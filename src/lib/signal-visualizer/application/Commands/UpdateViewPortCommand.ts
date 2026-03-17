import type {Interpreter} from "@/lib/signal-visualizer/core/Interpreter.ts";


export class UpdateViewPortCommand {
    interpreter: Interpreter;

    async handle(startSeconds : number): Promise<void> {
        await this.interpreter.updateViewport(startSeconds)
    }

    constructor(interpreter: Interpreter) {
        this.interpreter = interpreter;
    }
}
