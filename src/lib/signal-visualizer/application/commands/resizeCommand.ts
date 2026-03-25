import type { Interpreter } from '@/lib/signal-visualizer/core/interpreter.ts'

export class ResizeDto {
    width: number
    height: number

    constructor(width: number, height: number) {
        this.width = width
        this.height = height
    }
}

export class ResizeCommand {
    interpreter: Interpreter

    async handle(dto: ResizeDto): Promise<void> {
        await this.interpreter.resize(dto.width, dto.height)
    }

    constructor(interpreter: Interpreter) {
        this.interpreter = interpreter
    }
}
