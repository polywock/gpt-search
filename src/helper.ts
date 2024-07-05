
export function timeout(ms: number): Promise<void> {
    return new Promise((res, rej) => setTimeout(() => res(), ms))
}

export class QueueLock {
  public promiseChain = Promise.resolve()
  private chainLength = 0 

  wait(ms: number) {
    const oldChain = this.promiseChain
    this.promiseChain = oldChain.then(() => timeout(ms))
    
    if (this.chainLength++ > 100) {
      this.promiseChain = Promise.resolve()
      this.chainLength = 0 
    }
    return oldChain
  }
}

export function round(value: number, precision: number): number {
	const scalar = 10 ** precision
	return Math.round(value * scalar) / scalar
}

export function clamp(min: number, max: number, value: number) {
    let clamped = value 
    if (min != null) {
      clamped = Math.max(min, clamped)
    }
    if (max != null) {
      clamped = Math.min(max, clamped)
    }
    return clamped 
}

export function randomId() {
  return Math.ceil(Math.random() * 1E10).toString()
}

export function shuffle<T>(arr: T[]): T {
  return arr.at(Math.floor(Math.random() * arr.length))
}

export function assertType<T>(value: any): asserts value is T { }

export function createElement(text: string) {
  const temp = document.createElement('div')
  temp.innerHTML = text
  return temp.firstElementChild
}