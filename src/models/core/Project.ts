import { generateId } from '../../utils/commonUtils';
import { Base } from '../index';

class Project extends Base {
  readonly id: string;
  name: string;
  path: string;
  tags: Array<string>;

  constructor(name: string, path: string, tags: Array<string>) {
    super();
    this.id = generateId('proj');
    this.name = name;
    this.path = path;
    this.tags = tags;
  }

  /**
   * Add a tag to this project
   */
  addTag(tag: string): void {
    if (this.tags.includes(tag)) {
      throw new Error(`Tag ${tag} already exists`); // TODO: Throw Business error
    } else {
      this.tags.push(tag);
      this.touch();
    }
  }

  /**
   * Remove a tag from this project
   */
  removeTag(tag: string) {
    const index = this.tags.indexOf(tag);
    if (index === -1) {
      throw new Error(`Tag ${tag} does not exist`); // TODO: Throw Business error
    } else {
      this.tags.splice(index, 1);
      this.touch();
    }
  }
}

export { Project };

