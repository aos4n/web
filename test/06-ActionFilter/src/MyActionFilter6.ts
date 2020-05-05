import { ActionFilter, ActionFilterContext, DoAfter, DoBefore } from '../../../bin';

@ActionFilter
export class MyActionFilter6 {
    m: number = 1
    n: number = 1
    @DoBefore
    before(actionFilterContext: ActionFilterContext) {
        this.m = 2
    }

    @DoAfter
    after(actionFilterContext: ActionFilterContext) {
        this.n = 2
    }
}