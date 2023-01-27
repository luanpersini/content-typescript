# Typescript tips, tricks and other related topics.

## Topics 

- [Handling multiple calls with Async/Await and Promise.All](https://github.com/luanpersini/content-typescript#handling-multiple-calls-with-asyncawait-and-promiseall)

## Local Setup

1. Clone the repository
2. Run `npm install`
3. To run a file, `npx ts-node file-relative-path.ts`

---
## Handling multiple calls with Async/Await and Promise.All

I will start this topic with some basic consepts:

- **Synchronous** operations are done sequentially, one operation must finish before the thread can move to the next. Its a blocking architecture. 
- **Asynchronous** operations can be executed in any order, or even simultaneously. Its a non-blocking architecture.

"The async and await keywords enable asynchronous, promise-based behavior to be written in a cleaner style, avoiding the need to explicitly configure promise chains." (Mozilla)

That said, i just discovered recently that i was using blocking code, instead of Asynchronous parallel or concurrent operations.

Lets that a loot at the code bellow:

```javascript
  const operation1 = await serviceOne()
  const operation2 = await serviceTwo() // Wait operation1 to be executed

// sec------1---------2---------3---------4
// =============================O           operation1
//                               =========O operation2                     
// =======================================O Total Elapsed Time (4 seconds)
```
<br>

This code seems ok, but it has a flaw: if operation2 dont depend on operation1, then youre losing performance, because its a blocking operation. Lets suppose serviceOne() takes 3 seconds to be completed and serviceTwo() takes 1 second. Following this approach, it would take 4 seconds to complete both operations (3+1).

Now, if we run the code bellow, both operations would start their execution almost at the same time, being executed concurrently. After 3 seconds (the longest time), both operations would be completed. The code will still execute operation2 after operation1 but it has already been executed, saving 1 second.

```javascript
  const op1 = serviceOne() //start execution
  const op2 = serviceTwo() //start execution
  const operation1 = await op1
  const operation2 = await op2

// sec------1---------2---------3
// =============================O operation1
// =========O                     operation2                     
// =============================O Total Elapsed Time (3 seconds)
```
<br>

Imagine a frontend application making 4 api calls and each one takes 1 second. With the blocking approach, it would take 4 seconds to complete the operations (1+1+1+1), while it would take only 1 second to complete all operations executing it concurrently.

Bellow are the code examples with blocking, concurrently and parallel promise execution:

- [Raw Code - Async/Await and Promise.All](https://github.com/luanpersini/content-typescript/blob/main/examples/async-await-promise-all.ts)
- [**Run in TSPlayground**](https://www.typescriptlang.org/play?strict=false#code/GYVwdgxgLglg9mABAZygQwE5QBQEpEDeAUIohAsnADYCmAdFXAObYDkAogB40QiwKIAyuiw0AJnUTsqaAA7JxiACowAtjUQBeRAAZWuEogw0oIDEjA0A7ogAiaKDTxEAvkSKhI-JDTBjsqJhQKur4xKTkYKiIvmIhNABciGhgAJ5aiJY29o7OpLRQiLDqtjDAwBmx8YgAtCgiwWoaAPTNMEiqyIat9RgwskUAFhqdhsU0peWIzdoAjDoL7qQ9TCYoPAhiXREUhQqRWxkAsg6DdBhw4P7jk8AGO1HU9IwsHDLyivFJrIgA1OsHZB-RA-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)
- To run in your computer: `npx ts-node examples\async-await-promise-all.ts`

### More about this topic

- https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/async_function
- https://stackoverflow.com/questions/45285129/any-difference-between-await-promise-all-and-multiple-await
- https://www.educative.io/answers/what-is-concurrent-programming
