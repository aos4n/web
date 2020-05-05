import { Typed } from 'aos4n-core';

import { NotNull } from '../../../bin';

export class Index1IM {
    @Typed
    @NotNull()
    id: number

    @Typed
    name: string
}