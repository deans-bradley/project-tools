/**
 * Base class for auditable objects
 */
class Base {
  readonly createdDate: Date;
  modifiedDate: Date;

  constructor(createdDate?: Date, modifiedDate?: Date) {
    this.createdDate = createdDate || new Date();
    this.modifiedDate = modifiedDate || new Date();
  }

  touch(): void {
    this.modifiedDate = new Date();
  }
}

export { Base };

