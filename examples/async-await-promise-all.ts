function start() {
  console.log('Execution Started. Elapsed Time = 0')
  return new Date()
}

function end(startTime) {
  const endTime: any = new Date()
  let timeDiff = endTime - startTime //in ms
  // strip the ms
  timeDiff /= 1000

  // get seconds
  const seconds = Math.round(timeDiff)
  console.log('Elapsed Time: ' + seconds + ' seconds')  
}

function slowResolveAfter3Seconds() {
  console.log('starting Slow promise')
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve('resolved value: Slow')
      console.log('Slow promise is done')
    }, 3000)
  })
}

function fastResolveAfter1Second() {
  console.log('starting Fast promise')
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve('resolved value: Fast')
      console.log('Fast promise is done')
    }, 1000)
  })
}

async function sequentialStart() {
  console.log('==SEQUENTIAL START==')

  //This approach will execute code in sequence, "locking" the code execution till each awaited method is completed.
  // Execution gets here almost instantly - Total Elapsed Time = 0
  const startTime = start()
  const slow = await slowResolveAfter3Seconds().then((result) => {
    end(startTime) //Total Elapsed Time = 3 seconds.
    return result
  })
  console.log(slow) // ['slow promise is done']

  const fast = await fastResolveAfter1Second().then((result) => {
    end(startTime) //Total Elapsed Time = 4 seconds (3+1).
    return result
  })
  console.log(fast) // ['fast promise is done']
}

async function concurrentStart() {
  console.log('==CONCURRENT START with await==')

  //This approach will start the code execution of slow and fast in sequence, almost at the same time, but without "locking" the code execution.
  //Both slow and fast will share the thread, where fast will finish its execution first, but the result will only be logged after the slow method is completed.
  const startTime = start()
  const slow = slowResolveAfter3Seconds() // starts timer immediately
  const fast = fastResolveAfter1Second() // starts timer immediately

  // Execution gets here almost instantly - Total Elapsed Time = 0
  console.log(await slow) // ['slow promise is done'] - Total Elapsed Time = 3 seconds.  
  console.log(await fast) // ['fast promise is done'] - Total Elapsed Time = 3 seconds. This runs immediately after slow, since fast is already resolved
  end(startTime)
}

function concurrentPromise() {
  console.log('==CONCURRENT START with Promise.all==')
  // Same as concurrentStart
  const startTime = start()
  return Promise.all([slowResolveAfter3Seconds(), fastResolveAfter1Second()])
    .then((messages) => {
      console.log(messages[0]) // ['slow promise is done'] - Total Elapsed Time = 3 seconds.      
      console.log(messages[1]) // ['fast promise is done'] - Total Elapsed Time = 3 seconds.
    })
    .then(() => end(startTime))
}

async function parallel() {
  console.log('==PARALLEL with await Promise.all==')

  //This approach will start the code execution of slow and fast in sequence, almost at the same time, but without "locking" the code execution.
  //Both slow and fast will share the thread, where fast will finish its execution first, without waiting for the slow method.
  //Start 2 "jobs" in parallel. The result will be available outside the Promise.All only after both operations are completed.
  
  const startTime = start()
  await Promise.all([
    (async () => console.log(await slowResolveAfter3Seconds().then((result) => {
      end(startTime)
      return result
    })))(),
    (async () => console.log(await fastResolveAfter1Second().then((result) => {
      end(startTime)
      return result
    })))()
  ])
  // ['fast promise is done'] - Total Elapsed Time = 1 second.
  // ['slow promise is done'] - Total Elapsed Time = 3 seconds.
}

// You can run each function without the timeout, its here so it can be executed in sequence.

sequentialStart() // after 3 seconds, logs "slow", then after 1 more second, "fast" (Total elapsed Time = 4 seconds)

// wait above to finish
setTimeout(concurrentStart, 5000) // after 3 seconds, logs "slow" and then "fast" (Total elapsed Time = 3 seconds)

// wait again
setTimeout(concurrentPromise, 9000) // same as concurrentStart (Total elapsed Time = 3 seconds)

// wait again
setTimeout(parallel, 13000) // truly parallel: after 1 second, logs "fast", then after 2 more seconds, "slow" (Total elapsed Time = 3 seconds)


//const [r1, r2] = await Promise.all([task(1, 3, false), task(2, 3, false)])