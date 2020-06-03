import Observer from './Observer'

class Subject {
  private observers: Observer[] = []

  public attach(observer: Observer): void {
    const isExist = this.observers.includes(observer)
    if (isExist) {
      return console.log('Subject: Observer has been attached already.')
    }

    console.log('Subject: Attached an observer.')
    this.observers.push(observer)
  }

  public detach(observer: Observer): void {
    const observerIndex = this.observers.indexOf(observer)
    if (observerIndex === -1) {
      return console.log('Subject: Nonexistent observer.')
    }

    this.observers.splice(observerIndex, 1)
    console.log('Subject: Detached an observer.')
  }

  public notify(updateType: number): void {
    console.log('Subject: Notifying observers...')
    for (const observer of this.observers) {
      observer.update(updateType, this)
    }
  }
}

export default Subject
