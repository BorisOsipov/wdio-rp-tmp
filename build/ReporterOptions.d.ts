import { LEVEL, MODE } from "./constants";
export default class ReporterOptions {
    debug: boolean;
    autoAttachScreenshots: boolean;
    screenshotsLogLevel: LEVEL;
    reportSeleniumCommands: boolean;
    seleniumCommandsLogLevel: LEVEL;
    parseTagsFromTestTitle: boolean;
    reportPortalClientConfig: {
        mode: MODE;
        tags: any[];
        description: string;
    };
}
