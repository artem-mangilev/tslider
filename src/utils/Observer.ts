import Subject from './Subject'

export default interface Observer {
  update(updateType: number, subject: Subject): void
}
