import * as uuid from 'uuid';
import { FormResponse } from '../interfaces/form_response.interface';

export const generateChildren = (children: any) => {
  const arrs: any = [];
  const generateItemChildren = (parent_id, children) => {
    const array: FormResponse[] = [];
    for (let i = 0; i < children.length; i++) {
      const item: FormResponse = {
        control: children[i].children,
        content: children[i].content,
        form_mark: children[i].from_mark,
        to_mark: children[i].to_mark,
        category: children[i].category,
        unit: children[i].unit,
        required: children[i].required,
        parent_id: parent_id,
        ref: uuid(),
      };
      array.push(item);

      if (children[i].children && children[i].children.length) {
        generateItemChildren(item.ref, children[i].children);
      }
    }
    arrs.push(array);
  };

  generateItemChildren(0, children);

  return arrs;
};
