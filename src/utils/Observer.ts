import Subject from './Subject'

export default interface Observer {
  update(subject: Subject): void
}
