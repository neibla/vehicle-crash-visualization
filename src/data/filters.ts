import Crash from "./Crash";

function crashInvolvementFilter(crash: Crash, involvementKey: string) {
    return crash[involvementKey] > 0;
}

export function includeCrash(crash: Crash, controls: any) {
    const {
        showFatalCrashes,
        showSeriousCrashes,
        showMinorCrashes,
        onlyShowHolidayCrashes,
        yearRange: [startYear, endYear],
        crashInvolvement
    } = controls;
    const { fatalCount, seriousInjuryCount, minorInjuryCount } = crash;
    if (crash.crashYear < startYear) {
        return false;
    } else if (crash.crashYear > endYear) {
        return false;
    } else if (onlyShowHolidayCrashes && !crash.holiday) {
        return false;
    } else if (crashInvolvement !== "all") {
        return crashInvolvementFilter(crash, crashInvolvement);
    } else if (showFatalCrashes && fatalCount > 0) {
        return true;
    } else if (showSeriousCrashes && seriousInjuryCount > 0) {
        return true;
    } else if (showMinorCrashes && minorInjuryCount > 0) {
        return true;
    } else {
        return false;
    }
}

