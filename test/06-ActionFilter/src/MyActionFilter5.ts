import { ActionFilter, ActionFilterContext, DoAfter, DoBefore } from '../../../bin';

@ActionFilter
export class MyActionFilter5 {
    n: number = 1
    @DoBefore
    before(actionFilterContext: ActionFilterContext) {
        actionFilterContext.ctx.body = '在DoBefore发送响应'
    }

    @DoAfter
    after(actionFilterContext: ActionFilterContext) {
        this.n = 2
    }
}