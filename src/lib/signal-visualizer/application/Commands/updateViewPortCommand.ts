import type { Interpreter } from '@/lib/signal-visualizer/core/interpreter.ts'

export class UpdateViewPortCommand {
    interpreter: Interpreter

    async handle(startSeconds: number): Promise<void> {
        await this.interpreter.updateViewport(startSeconds)
    }

    constructor(interpreter: Interpreter) {
        this.interpreter = interpreter
    }
}
