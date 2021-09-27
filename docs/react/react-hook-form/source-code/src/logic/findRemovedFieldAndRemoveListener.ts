import removeAllEventListeners from './removeAllEventListeners';
import isRadioInput from '../utils/isRadioInput';
import isDetached from '../utils/isDetached';
import { Field, FieldsRefs, FieldValues } from '../types';

export default function findRemovedFieldAndRemoveListener<
  FormValues extends FieldValues
>(
  fields: FieldsRefs<FormValues>,
  validateWithStateUpdate: Function | undefined = () => {},
  field: Field,
  forceDelete: boolean = false,
): void {
  if (!field) return;

  const { ref, mutationWatcher, options } = field;

  if (!ref || !ref.type) return;

  const { name, type } = ref;

  if (isRadioInput(type) && options) {
    options.forEach(({ ref }, index): void => {
      if ((options[index] && isDetached(ref)) || forceDelete) {
        removeAllEventListeners(options[index], validateWithStateUpdate);
        (
          options[index].mutationWatcher || { disconnect: () => {} }
        ).disconnect();
        options.splice(index, 1);
      }
    });

    if (!options.length) delete fields[name];
  } else if (isDetached(ref) || forceDelete) {
    removeAllEventListeners(ref, validateWithStateUpdate);
    if (mutationWatcher) mutationWatcher.disconnect();
    delete fields[name];
  }
}
