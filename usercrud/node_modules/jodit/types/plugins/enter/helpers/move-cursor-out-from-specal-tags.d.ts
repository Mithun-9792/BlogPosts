/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2022 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */
/**
 * @module plugins/enter
 */
import type { IJodit, Nullable, HTMLTagNames } from '../../../types';
/**
 * Checks if the cursor is on the edge of a special tag and exits if so
 */
export declare function moveCursorOutFromSpecialTags(jodit: IJodit, current: Nullable<Node>, tags: HTMLTagNames[]): void;
