import type {Interpreter} from "@/lib/signal-visualizer/core/Interpreter.ts";


export class ChangeChannelVisibilityCommand {
    interpreter: Interpreter;

    async handle(channelLabel: string, visibility: boolean): Promise<void> {
        await this.interpreter.changeChannelVisibility(channelLabel, visibility)
    }

    constructor(interpreter: Interpreter) {
        this.interpreter = interpreter;
    }
}
