import type {Interpreter} from "@/lib/signal-visualizer/core/Interpreter.ts";
import {ViewPort} from "@/lib/signal-visualizer/application/SignalSource.ts";


export class ChangeViewPortCommand {
    interpreter: Interpreter;

    async handle(startSeconds : number, lengthSeconds : number): Promise<void> {
        const viewPort = new ViewPort(startSeconds, lengthSeconds)
        await this.interpreter.changeViewPort(viewPort)
    }

    constructor(interpreter: Interpreter) {
        this.interpreter = interpreter;
    }
}
