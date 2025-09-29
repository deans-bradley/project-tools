/**
 * Base class for auditable objects
 */
class Base {
  constructor(createdDate, modifiedDate) {
    this.createdDate = createdDate;
    this.modifiedDate = modifiedDate;
  }
}

export { Base };