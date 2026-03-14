import type {Interpreter} from "@/lib/signal-visualizer/core/Interpreter.ts";


export class DestroyCommand {
    interpreter: Interpreter;

    async handle(): Promise<void> {
        await this.interpreter.destroy()
    }

    constructor(interpreter: Interpreter) {
        this.interpreter = interpreter;
    }
}
