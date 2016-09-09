/// <reference types="jquery" />

namespace i18n {
    "use strict";

    /**
     * LangTag - lang-region
     * Examples: en, en-US
     */
    export interface LangTag {
        lang: string;
        region?: string;

        /**
         * Exact match. It is just equals.
         *
         * true  | this: en-us -> other: en-us
         * true  | this: en-?? -> other: en-??
         * false | this: en-?? -> other: en-us
         * false | this: en-us -> other: en-??, en-gb
         *
         * @param other
         * @returns {boolean}
         */
        exactlyMatches(other: LangTag): boolean;

        /**
         * Approx match. It is not equals as doesn't meet equals rules!
         * Approx = region doesn't matter.
         *
         * true  | this: en-us -> other: en-us, en-gb, en-??
         * true  | this: en-?? -> other: en-??, en-us, en-gb
         * false | this: en-us -> other: pl-pl, pl-us
         *
         * @param other
         * @returns {boolean}
         */
        approxMatches(other: LangTag): boolean;
    }

    export interface LangFinder {
        user(): LangTag[];
        server(): LangTag[];
    }

    export interface LangSelector {
        select(finder: LangFinder): [LangTag, SelectType];
    }

    export enum SelectType {
        APPROX = 0,
        EXACTLY = 1,
        DEFAULT = 2
    }

    export interface LangSetter {
        getLT(): LangTag;
        setLT(langTag: LangTag): void;
    }

    export interface Key {
        path: string;
        params: string[];
    }

    export interface Translator {
        translate(p: Key): string;

        translatable(): JQuery;

        setTr($e: JQuery, p?: Key): void;

        setAllTr($e: JQuery, p?: Key): void;

        unsetTr($e: JQuery): void;

        init(error?: (() => void), callback?: (() => void)): void;
    }
}
