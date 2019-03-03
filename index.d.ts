import {LEVEL} from "./lib/constants";

declare namespace WdioReportPortalReporter {
    function sendLog(
        level: LEVEL,
        message: any,
    ): void;
}

declare module "index" {
    export default WdioReportPortalReporter;
}
// level: LEVEL, message: any
