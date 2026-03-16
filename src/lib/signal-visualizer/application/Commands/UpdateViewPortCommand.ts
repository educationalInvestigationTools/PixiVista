import type {Interpreter} from "@/lib/signal-visualizer/core/Interpreter.ts";


export class UpdateViewPortCommand {
    interpreter: Interpreter;

    async handle(sampleStart: number, n: number): Promise<void> {
        await this.interpreter.updateData(sampleStart, n)
    }

    constructor(interpreter: Interpreter) {
        this.interpreter = interpreter;
    }
}
