import { Utils } from 'aos4n-core';

import {
    AllMapping, Controller, DeleteMapping, GetMapping, HeadMapping, Mapping, PatchMapping,
    PostMapping, PutMapping
} from '../../../bin';

@Controller()
export class HomeController {
    @Mapping()
    index1() {
        return 'ok'
    }

    @Mapping('get', '/i2')
    index2() {
        return 'ok'
    }

    @AllMapping()
    index3() {
        return 'ok'
    }

    @GetMapping()
    index4() {
        return 'ok'
    }

    @PostMapping()
    index5() {
        return 'ok'
    }

    @PutMapping()
    index6() {
        return 'ok'
    }

    @PatchMapping()
    index7() {
        return 'ok'
    }

    @DeleteMapping()
    index8() {
        return 'ok'
    }

    @HeadMapping()
    index9() {
        return 'ok'
    }

    @Mapping()
    async index10() {
        await Utils.sleep(50)
        return 'ok'
    }

    @Mapping()
    index11() {
        return new Promise(resolve => {
            setTimeout(function () {
                resolve('ok')
            }, 50)
        })
    }

    @Mapping()
    index12() {
    }
}