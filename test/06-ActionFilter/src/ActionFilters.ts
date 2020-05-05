import {
    ActionFilter, ActionFilterContext, DoAfter, DoBefore, GlobalActionFilter
} from '../../../bin';

@ActionFilter
export class MyActionFilter1 {
    @DoBefore
    before(actionFilterContext: ActionFilterContext) {
        process.env._test = process.env._test || ''
        process.env._test += 'a'
    }

    @DoAfter
    after(actionFilterContext: ActionFilterContext) {
        process.env._test = process.env._test || ''
        process.env._test += 'b'
    }
}

@ActionFilter
export class MyActionFilter2 {
    @DoBefore
    before(actionFilterContext: ActionFilterContext) {
        process.env._test = process.env._test || ''
        process.env._test += 'c'
    }

    @DoAfter
    after(actionFilterContext: ActionFilterContext) {
        process.env._test = process.env._test || ''
        process.env._test += 'd'
    }
}

@ActionFilter
export class MyActionFilter3 {
    @DoBefore
    before(actionFilterContext: ActionFilterContext) {
        process.env._test = process.env._test || ''
        process.env._test += 'e'
    }

    @DoAfter
    after(actionFilterContext: ActionFilterContext) {
        process.env._test = process.env._test || ''
        process.env._test += 'f'
    }
}

@ActionFilter
export class MyActionFilter4 {
    @DoBefore
    before(actionFilterContext: ActionFilterContext) {
        process.env._test = process.env._test || ''
        process.env._test += 'g'
    }

    @DoAfter
    after(actionFilterContext: ActionFilterContext) {
        process.env._test = process.env._test || ''
        process.env._test += 'h'
    }
}

@GlobalActionFilter({ order: 1 })
export class MyGlobalActionFilter1 {
    @DoBefore
    before(actionFilterContext: ActionFilterContext) {
        process.env._test = process.env._test || ''
        process.env._test += 'i'
    }

    @DoAfter
    after(actionFilterContext: ActionFilterContext) {
        process.env._test = process.env._test || ''
        process.env._test += 'j'
    }
}

@GlobalActionFilter({ order: 2 })
export class MyGlobalActionFilter2 {
    @DoBefore
    before(actionFilterContext: ActionFilterContext) {
        process.env._test = process.env._test || ''
        process.env._test += 'k'
    }

    @DoAfter
    after(actionFilterContext: ActionFilterContext) {
        process.env._test = process.env._test || ''
        process.env._test += 'l'
    }
}

@GlobalActionFilter({ order: 2, match: /^\/home2/i })
export class MyGlobalActionFilter3 {
    @DoBefore
    before(actionFilterContext: ActionFilterContext) {
        actionFilterContext.ctx.state.str = '1'
    }
}