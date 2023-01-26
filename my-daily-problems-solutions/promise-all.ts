let startTime

function start() {
  startTime = new Date()
  console.log('Execution Started')
}

function end() {
  const endTime: any = new Date()
  let timeDiff = endTime - startTime //in ms
  // strip the ms
  timeDiff /= 1000

  // get seconds
  const seconds = Math.round(timeDiff)
  console.log('Elapsed Time: ' + seconds + ' seconds')
}

start() // Execution Started

// Uma promise simples que é resolvida após certo tempo
async function timeOut(ms: number) {
  await new Promise((resolve) => setTimeout(resolve, ms)).then(()=> end())
  return "completed"
}

const task = function (taskNum, seconds, negativeScenario) {
  return new Promise((resolve) => {
    setTimeout(() => {
      end()
      resolve('Task ' + taskNum + ' succeed!')
    }, seconds * 1000)
  })
}

// Promise.all alternative
async function run() {
  // tasks run immediately in parallel and wait for both results
  const [r1, r2] = await Promise.all([task(1, 3, false), task(2, 3, false)])
 
  console.log(r1 + ' ' + r2)
}
run()
// at 5th sec: Task 1 succeed! Task 2 succeed!


const run2 = async function() {
  // tasks run immediately in parallel
  const t1 = task(1, 3, false)
  const t2 = task(2, 3, false)
  // wait for both results
  const r1 = await t1
  const r2 = await t2
  console.log(r1 + ' ' + r2)
}
run2()