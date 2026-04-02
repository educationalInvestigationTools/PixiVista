import { EdfDecoder } from '@epicurrents/edf-reader'
import { type SignalSource, type OneDimSignalRaw } from '@/lib/signal-visualizer/application/types/signalSource.ts'
import { ViewPort } from '@/lib/signal-visualizer/application/types/viewPort.ts'

type DecodedEdf = NonNullable<ReturnType<EdfDecoder['decode']>>
type DecodedHeader = DecodedEdf['header']
type DecodedSignalInfo = DecodedHeader['signalInfo'][number]

const EDF_SAMPLE_BYTES = Int16Array.BYTES_PER_ELEMENT

type EdfSharedMetadata = {
    edfPath: string
    sourceUrl: string
    headerRecordBytes: number
    recordByteSize: number
    dataRecordCount: number
    dataRecordDuration: number
}

type EdfChannelMetadata = {
    label: string
    samplingFrequency: number
    samplesPerRecord: number
    totalSamples: number
    byteOffsetInRecord: number
    unitsPerBit: number
    digitalOffset: number
}

type CachedRecordWindow = {
    startRecord: number
    endRecord: number
    signal: Float32Array
}

export class EdfChannelSignalSource implements SignalSource {
    private readonly _shared: EdfSharedMetadata
    private readonly _channel: EdfChannelMetadata
    private _cachedRecordWindow: CachedRecordWindow | null = null

    constructor(sharedMetadata: EdfSharedMetadata, channelMetadata: EdfChannelMetadata) {
        this._shared = sharedMetadata
        this._channel = channelMetadata
    }

    get totalSeconds(): number {
        return this._channel.totalSamples / this._channel.samplingFrequency
    }

    get label(): string {
        return this._channel.label
    }

    async read(viewport: ViewPort): Promise<OneDimSignalRaw> {
        const samplingFrequency = this._channel.samplingFrequency
        const startSeconds = Math.max(0, viewport.startSeconds)
        const endSeconds = Math.min(this.totalSeconds, Math.max(startSeconds, viewport.startSeconds + viewport.lengthSeconds))
        const startSample = Math.max(0, Math.floor(startSeconds * samplingFrequency))
        const endSampleExclusive = Math.min(
            this._channel.totalSamples,
            Math.ceil(endSeconds * samplingFrequency),
        )

        if (endSampleExclusive <= startSample) {
            return {
                xValues: new Float32Array(0),
                yValues: new Float32Array(0),
            }
        }

        const samplesPerRecord = this._channel.samplesPerRecord
        const startRecord = Math.floor(startSample / samplesPerRecord)
        const endRecord = Math.floor((endSampleExclusive - 1) / samplesPerRecord)
        const recordWindowSignal = await this._readRecordWindow(startRecord, endRecord)

        const firstSampleInRecordWindow = startRecord * samplesPerRecord
        const localStart = Math.max(0, startSample - firstSampleInRecordWindow)
        const requestedSampleCount = endSampleExclusive - startSample
        const localEnd = Math.min(recordWindowSignal.length, localStart + requestedSampleCount)

        const yValues = recordWindowSignal.slice(localStart, localEnd)
        const xValues = new Float32Array(yValues.length)
        const firstTimeSeconds = startSample / samplingFrequency

        for (let i = 0; i < yValues.length; i++) {
            xValues[i] = firstTimeSeconds + i / samplingFrequency
        }

        return {
            xValues,
            yValues,
        }
    }

    private async _readRecordWindow(startRecord: number, endRecord: number): Promise<Float32Array> {
        const cached = this._cachedRecordWindow
        if (cached && cached.startRecord <= startRecord && cached.endRecord >= endRecord) {
            const startOffset = (startRecord - cached.startRecord) * this._channel.samplesPerRecord
            const length = (endRecord - startRecord + 1) * this._channel.samplesPerRecord
            return cached.signal.subarray(startOffset, startOffset + length)
        }

        const dataStartByte = this._shared.headerRecordBytes + startRecord * this._shared.recordByteSize
        const dataEndByte = this._shared.headerRecordBytes + (endRecord + 1) * this._shared.recordByteSize - 1
        const rangeBuffer = await fetchRange(
            this._shared.sourceUrl,
            dataStartByte,
            dataEndByte,
            this._shared.edfPath,
        )

        const recordCount = endRecord - startRecord + 1
        const decodedSignal = this._decodeChannelFromRecordWindow(rangeBuffer, recordCount)

        this._cachedRecordWindow = {
            startRecord,
            endRecord,
            signal: decodedSignal,
        }

        return decodedSignal
    }

    private _decodeChannelFromRecordWindow(buffer: ArrayBuffer, recordCount: number): Float32Array {
        const result = new Float32Array(recordCount * this._channel.samplesPerRecord)
        const dataView = new DataView(buffer)
        let resultIndex = 0

        for (let recordIndex = 0; recordIndex < recordCount; recordIndex++) {
            const recordByteBase =
                recordIndex * this._shared.recordByteSize + this._channel.byteOffsetInRecord

            for (let sampleIndex = 0; sampleIndex < this._channel.samplesPerRecord; sampleIndex++) {
                const sampleByteOffset = recordByteBase + sampleIndex * EDF_SAMPLE_BYTES
                const digitalSample = dataView.getInt16(sampleByteOffset, true)
                result[resultIndex] =
                    this._channel.unitsPerBit * (digitalSample + this._channel.digitalOffset)
                resultIndex += 1
            }
        }

        return result
    }
}

function toViteFsUrl(path: string): string {
    if (path.startsWith('/@fs/')) {
        return path
    }
    if (path.startsWith('/')) {
        return `/@fs${encodeURI(path)}`
    }
    return path
}

function uniqueLabel(baseLabel: string, occurrences: Map<string, number>): string {
    const seen = occurrences.get(baseLabel) ?? 0
    occurrences.set(baseLabel, seen + 1)

    if (seen === 0) {
        return baseLabel
    }

    return `${baseLabel} (${seen + 1})`
}

async function fetchRange(
    sourceUrl: string,
    startByte: number,
    endByte: number,
    edfPath: string,
): Promise<ArrayBuffer> {
    const response = await fetch(sourceUrl, {
        headers: {
            Range: `bytes=${startByte}-${endByte}`,
        },
    })

    if (!response.ok) {
        throw new Error(
            `Could not read EDF byte range ${startByte}-${endByte} from ${edfPath} ` +
                `(${response.status} ${response.statusText}).`,
        )
    }

    if (response.status !== 206) {
        throw new Error(
            `The dev server did not honor range requests for ${edfPath}. ` +
                `Range-based reading is required to avoid loading the full EDF into RAM.`,
        )
    }

    return await response.arrayBuffer()
}

async function loadEdfHeader(sourceUrl: string, edfPath: string): Promise<DecodedHeader> {
    const decoder = new EdfDecoder()

    const mainHeader = await fetchRange(sourceUrl, 0, 255, edfPath)
    decoder.setInput(mainHeader, 'edf')

    const basicHeader = decoder.decodeHeader(true)
    if (!basicHeader) {
        throw new Error(`Could not parse EDF base header for ${edfPath}.`)
    }

    const headerBytes =
        basicHeader.headerRecordBytes > 0
            ? basicHeader.headerRecordBytes
            : (basicHeader.signalCount + 1) * 256

    if (headerBytes < 256) {
        throw new Error(`Invalid EDF header size ${headerBytes} for ${edfPath}.`)
    }

    if (headerBytes > 256) {
        const fullHeaderRemainder = await fetchRange(sourceUrl, 256, headerBytes - 1, edfPath)
        decoder.appendInput(fullHeaderRemainder)
    }

    const fullHeader = decoder.decodeHeader()
    if (!fullHeader) {
        throw new Error(`Could not parse EDF signal metadata for ${edfPath}.`)
    }

    return fullHeader
}

function buildSignalByteOffsets(signalInfo: DecodedSignalInfo[]): number[] {
    const offsets: number[] = []
    let offset = 0

    for (let i = 0; i < signalInfo.length; i++) {
        const info = signalInfo[i]!
        offsets.push(offset)
        offset += Math.max(0, Math.floor(info.sampleCount)) * EDF_SAMPLE_BYTES
    }

    return offsets
}

export async function loadEdfSignalSourcesFromPath(edfPath: string): Promise<SignalSource[]> {
    const sourceUrl = toViteFsUrl(edfPath)
    const header = await loadEdfHeader(sourceUrl, edfPath)

    if (header.dataRecordDuration <= 0) {
        throw new Error(`Invalid EDF record duration (${header.dataRecordDuration}) for ${edfPath}.`)
    }

    const signalByteOffsets = buildSignalByteOffsets(header.signalInfo)
    const derivedRecordByteSize =
        signalByteOffsets.length > 0
            ? signalByteOffsets[signalByteOffsets.length - 1]! +
              Math.max(0, Math.floor(header.signalInfo[header.signalInfo.length - 1]?.sampleCount ?? 0)) *
                  EDF_SAMPLE_BYTES
            : 0

    const sharedMetadata: EdfSharedMetadata = {
        edfPath,
        sourceUrl,
        headerRecordBytes:
            header.headerRecordBytes > 0
                ? header.headerRecordBytes
                : (header.signalCount + 1) * 256,
        recordByteSize: header.recordByteSize > 0 ? header.recordByteSize : derivedRecordByteSize,
        dataRecordCount: Math.max(0, Math.floor(header.dataRecordCount)),
        dataRecordDuration: header.dataRecordDuration,
    }

    const channelLabels = new Map<string, number>()
    const signalSources: SignalSource[] = []

    for (let i = 0; i < header.signalInfo.length; i++) {
        const signalInfo = header.signalInfo[i]!
        const samplesPerRecord = Math.max(0, Math.floor(signalInfo.sampleCount))
        if (samplesPerRecord <= 0) {
            continue
        }

        const baseLabel = signalInfo.label?.trim() || `Channel ${i + 1}`
        if (baseLabel.toLowerCase() === 'edf annotations') {
            continue
        }

        const samplingFrequency = samplesPerRecord / sharedMetadata.dataRecordDuration

        if (!Number.isFinite(samplingFrequency) || samplingFrequency <= 0) {
            continue
        }

        const channelMetadata: EdfChannelMetadata = {
            label: uniqueLabel(baseLabel, channelLabels),
            samplingFrequency,
            samplesPerRecord,
            totalSamples: samplesPerRecord * sharedMetadata.dataRecordCount,
            byteOffsetInRecord: signalByteOffsets[i]!,
            unitsPerBit: Number.isFinite(signalInfo.unitsPerBit) ? signalInfo.unitsPerBit : 0,
            digitalOffset: Number.isFinite(signalInfo.digitalOffset) ? signalInfo.digitalOffset : 0,
        }

        signalSources.push(
            new EdfChannelSignalSource(sharedMetadata, channelMetadata),
        )
    }

    return signalSources
}
