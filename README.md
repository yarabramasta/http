# http
Me having fun with deno std/http.

Server bootstrapper for building an API with deno std/http library.

I'm not gonna add a support for web templating (obviously this library made for building API),
maybe gonna add a support for multipart request later.

# Example

## main.ts
```ts
import 'https://deno.land/x/deno_reflect@v0.2.1/mod.ts';

import { resolve } from 'https://deno.land/std@0.166.0/path/posix.ts';
import { Application } from 'https://raw.githubusercontent.com/yarabramasta/http/master/mod.ts';

// path/to/controllers/directory
const CONTROLLERS_PATH = resolve(Deno.cwd(), './controllers');
const controllers = [];

// read all ts files with _controller suffix
// too lazy to import it one by one :p
for await (const file of Deno.readDir(CONTROLLERS_PATH)){
  // read only file, if not a file (e.g a subdirectory) then continue reading
  if (!file.isFile) continue;
  
  // read only file with suffix, if without it then continue reading
  if (!/[a-zA-Z]+_controller\.ts/.test(file.name)) continue;

  // import all controllers module
  const Controller = await import(CONTROLLERS_PATH + `/${file.name}`);

  controllers.push(Controller.default);
}

// or you can explicitly import the controllers
// new Application([PingController, TestController]).start();

// instantiate the app
const app = new Application(controllers);

app.start();
```

## controllers/ping_controller.ts
```ts
import {
  Controller,
  Get,
  type IRequest,
  type Result
} from 'https://raw.githubusercontent.com/yarabramasta/http/master/mod.ts';

@Controller('/ping')
export default class PingController {
  @Get('/')
  public ping() {}

  @Get('/:foo')
  public foo(
    req: IRequest<{ foo: string }, { bar: string }>,
  ): Result<{ foo: string; bar: string }> {
    return {
      data: {
        foo: req.params.foo,
        bar: req.query.bar,
      },
    };
  }
}
```
