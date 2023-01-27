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

Imagine a frontend application making 4 api calls and each one takes 1 second. With the blocking approach, it would take 4 seconds to complete the operations (1+1+1+1), while it would take only 1 second to complete all operations executing it concurrently.

Bellow are the code examples with blocking, concurrently and parallel promise execution:

- [Async/Await and Promise.All]('examples\async-await-promise-all.ts')
- `npx ts-node examples\async-await-promise-all.ts`

### More about this topic

- https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/async_function
- https://stackoverflow.com/questions/45285129/any-difference-between-await-promise-all-and-multiple-await
