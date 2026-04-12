import type { Interpreter } from '@/lib/signal-visualizer/core/interpreter.ts'
import type { ViewPort } from '../types/viewPort'



export class ChangeViewPortCommand {
    interpreter: Interpreter

    async handle(viewPort: ViewPort): Promise<void> {
        await this.interpreter.changeViewPort(viewPort)
    }

    constructor(interpreter: Interpreter) {
        this.interpreter = interpreter
    }
}
