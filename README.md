# 介绍
aos4n-web是aos4n生态的web框架，基于koa2，封装了大量通用性功能，包括：参数绑定、参数验证、过滤器、声明式（装饰器）路由，再借助aos4n强大的组件化功能，使开发者更专注于业务逻辑的实现，从而节省时间、并且减少低级错误的产生。
# 安装
```bash
npm i aos4n/web
```
# 使用
```typescript
import path = require('path');
import { getContainer } from 'aos4n-core';

import { Application } from 'aos4n-web';

process.env.aos4nEntry = __filename
process.env.aos4nWebPort = 3000

getContainer().loadClass(Application).runAsync()
```
# api
## @Controller
使用@Controller装饰器标记一个类为控制器，并且传入一个可选的path参数，用于指定路由前缀。按照约定，控制器文件名应该以Controller结尾，但这不是必须的。

path参数也是可选的，如果不传，aos4n会指定这个类名的前面一部分并且转为小写作为路由前缀。比如：HomeController的默认路由前缀是/home。
```typescript
import { Controller, GetMapping, BindQuery } from "aos4n-web";

@Controller()
export class HomeController {
    @GetMapping()
    async index() {
        return 'ok'
    }
}
```
## @Mapping
用于将Controller内的方法映射为Action，需要传入method以及path参数。这两个参数不是必须的，默认会映射为get方法，并且使用方法名作为路由。

为了方便书写，我们提前准备好了几种常用的method对应的Mapping。分别是@GetMapping、@PostMapping、@PutMapping、@PatchMapping、@DeleteMapping、@HeadMapping。

如果你要映射所有的method，可以使用AllMapping。

一个方法可以使用多个Mapping标记，从而达到一个方法映射多个路由的目的。
```typescript
import { Controller, GetMapping, BindQuery, Mapping } from "aos4n-web";

@Controller()
export class HomeController {
    @Mapping('post')
    @GetMapping()
    async index() {
        return 'ok'
    }
}
```
## @BindContext
绑定Koa.Context
```typescript
@Controller()
export class HomeController{
  GetMapping()
  index(@BindContext ctx:Context){
    console.log(ctx.query.name)
    return 'ok'
  }
}
```
## @BindRequest
绑定Koa.Request
```typescript
@Mapping()
index2(@BindRequest req: Request) {
    return req.query.name
}
```
## @BindResponse
绑定Koa.Response
```typescript
@Mapping()
index3(@BindResponse res: Response) {
    return res.body = 'ok'
}
```
## @BindQuery
绑定url中的query参数
```typescript
@Mapping()
index4(@BindQuery('name') name: string) {
    return name
}
```
## @BindQuerys
绑定url中全部的的path参数为一个对象
```typescript
@Mapping()
index5(@BindQuerys im: Index5IM) {
    return im
}
```
## @BindPath
绑定url中的path参数
```typescript
@GetMapping('/i6/:name')
index6(@BindPath('name') name: string) {
    return name
}
```
## @BindPaths
绑定url中全部的的path参数为一个对象
```typescript
@GetMapping('/i7/:school/:grade')
index7(@BindPaths im: Index7IM) {
    return im
}
```
## @BindHeader
绑定header中的参数
```typescript
@Mapping()
index8(@BindHeader('ticket') ticket: string) {
    return ticket
}
```
## @BindBody
绑定请求体参数
```typescript
@PostMapping()
index9(@BindBody im: Index9IM) {
    return im
}
```
## @NotNull
验证器，目标参数a必须符合此规则：a != null
```typescript
@Typed
@NotNull()
id: number
```
## @NotEmpty
验证器，目标参数a必须符合此规则：a != null && a.length > 0，注意：aos4n在转换类型时会自动trim字符串
```typescript
@Typed
@NotEmpty()
name: string
```
## @Length
长度验证器，只能用于String、Array的验证，注意：aos4n在转换类型时会自动trim字符串

不会对null值进行验证，如需同时验证null，请添加@NotNull
```typescript
@Typed
@Length(2, 3)
name: string

TypedArray(String)
@Length(2, 3)
imgs: string[]
```
## @MinLength
最小长度验证器，只能用于String、Array的验证，注意：aos4n在转换类型时会自动trim字符串

不会对null值进行验证，如需同时验证null，请添加@NotNull
```typescript
@Typed
@MinLength(2)
name: string

TypedArray(String)
@MinLength(2)
imgs: string[]
```
## @MaxLength
最大长度验证器，只能用于String、Array的验证，注意：aos4n在转换类型时会自动trim字符串

不会对null值进行验证，如需同时验证null，请添加@NotNull
```typescript
@Typed
@MaxLength(2)
name: string

TypedArray(String)
@MaxLength(2)
imgs: string[]
```
## @Range
数值大小验证器，只能用于Number的验证

不会对null值进行验证，如需同时验证null，请添加@NotNull
```typescript
@Typed
@Range(2, 3)
id: number
```
## @Min
最小数值大小验证器，只能用于Number的验证

不会对null值进行验证，如需同时验证null，请添加@NotNull
```typescript
@Typed
@Min(2)
id: number
```
## @Max
最大数值大小验证器，只能用于Number的验证

不会对null值进行验证，如需同时验证null，请添加@NotNull
```typescript
@Typed
@Max(2)
id: number
```
## @Decimal
小数位验证器，只能用于Number的验证

不会对null值进行验证，如需同时验证null，请添加@NotNull
```typescript
@Typed
@Decimal(2, 3)
price: number
```
## @MinDecimal
最小小数位验证器，只能用于Number的验证

不会对null值进行验证，如需同时验证null，请添加@NotNull
```typescript
@Typed
@MinDecimal(2)
price: number
```
## @MaxDecimal
最大小数位验证器，只能用于Number的验证

不会对null值进行验证，如需同时验证null，请添加@NotNull
```typescript
@Typed
@MaxDecimal(2)
price: number
```
## @Reg
正则表达式验证器，只能用于String的验证，注意：aos4n在转换类型时会自动trim字符串

不会对null值进行验证，如需同时验证null，请添加@NotNull
```typescript
@Typed
@Reg(/^[a-z]$/)
name: string
```
## 自定义验证器
上面介绍了aos4n-web自带的几种验证器，应该可以满足大部分项目的需求了，如果有更加特殊的验证需求，你也可以自定义验证器
```typescript
import { Func } from "aos4n-web";

export function MyValidator(errorMesage: string = null) {
    errorMesage = errorMesage || '自定义验证不通过'
    return Func(a => {
        if (a == null) {
            return [true]
        }
        if (a.includes('1')) {
            return [true]
        }
        return [false, errorMesage]
    })
}
```
## @GlobalActionFilter
标记此类为全局请求过滤器，此类将会被aos4n自动扫描到并且应用到所有的控制器以及其Action
```typescript
@GlobalActionFilter({ order: 2, match: /^\/home2/i })
export class MyGlobalActionFilter3 {
    @DoBefore
    before(actionFilterContext: ActionFilterContext) {
        actionFilterContext.ctx.state.str = '1'
    }
}
```
## @ActionFilter
标记此类为局部请求过滤器，除非被显式使用（@UseActionFilter），否则不会生效，可以作用于Controller以及Action
```typescript
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
```
```typescript
@Controller()
export class Home1Controller {
    n: number = 1
    @UseActionFilter(MyActionFilter5)
    @GetMapping()
    index() {
        this.n = 2
        return 'ok'
    }
}
```
## @GlobalExceptionFilter
标记此类为全局异常过滤器，此类将会被aos4n自动扫描到并且应用到所有的控制器以及其Action
```typescript
@GlobalExceptionFilter({ match: /^\/home1/i })
export class MyGlobalExceptionFilter5 {
    @ExceptionHandler(Error)
    async handleError(ctx: any, error: Error) {
        ctx.body = 'MyGlobalExceptionFilter5'
    }
}
```
## @ExceptionFilter
标记此类为局部请求过滤器，除非被显式使用（@UseExceptionFilter），否则不会生效，可以作用于Controller以及Action
```typescript
@ExceptionFilter
export class MyExceptionFilter6 {
    @ExceptionHandler(MyException)
    async handleMyException(ctx: any, ex: MyException) {
        ctx.body = 'MyExceptionFilter6_MyException'
    }

    @ExceptionHandler(Error)
    async handleError(ctx: any, error: Error) {
        ctx.body = 'MyExceptionFilter6_Error'
    }
}
```
```typescript
@Controller()
@UseExceptionFilter(MyExceptionFilter6)
export class Home2Controller {
    @Mapping()
    index() {
        throw new MyException('err')
    }

    @Mapping()
    index1() {
        throw new MyException1('err')
    }
}
```
## 关于配置文件
aos4n使用统一的配置文件，即与package.json目录同级的config.json文件

aos4n-web的配置位于config.json的web节，具体字段说明如下：

名称 | 类型 | 默认值 | 说明
------------ | ------------- | ------------- | -------------
port | number | 3000 | 如果指定了环境变量aos4nWebPort，则优先使用环境变量的值
enableStatic | boolean | false | 是否开启静态内容支持，如果确定不需要静态内容支持，可以保持此选项关闭，可以提升性能，开启后，会使用public目录作为静态文件目录
enableCors | boolean | false | 是否开启跨域
corsOptions | CorsOptions | new CorsOptions() | 跨域选项，参考下面的CorsOptions
koaBodyOptions | KoaBodyOptions | new KoaBodyOptions() | 表单选项，该配置比较复杂，可以参考原项目说明https://github.com/dlau/koa-body

CorsOptions，具体说明请参考[koa2-cors](https://github.com/zadzbw/koa2-cors)

名称 | 类型 | 默认值 | 说明
------------ | ------------- | ------------- | -------------
origin | string | undefined
exposeHeaders | string[] | undefined
maxAge | number | undefined
credentials | boolean | undefined
allowMethods | string[] | undefined
allowHeaders | string[] | undefined

aos4n会智能的合并你在config.json提供的配置，只有你配置了的字段，aos4n才会使用你的，否则，使用该字段预设值