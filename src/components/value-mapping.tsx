import React from 'react';
import { css } from '@emotion/css';

import { DataType, TypeMapping } from '@types';

const SelectEmptyValue = 'Select an option';

export const ValueMapping = ({
  values,
  options,
  onChange,
}: {
  values: TypeMapping[];
  options: DataType[];
  onChange: (newMappings: TypeMapping[]) => void;
}) => {
  const selectOptions = [
    { id: 0, name: SelectEmptyValue, display_name: SelectEmptyValue }
  ].concat(options);

  return (
    <div>
      {values.length ?
        <table className={css`
          td, th {
            padding: 10px;
          }
        `}>
          <thead>
            <tr>
              <th>Field</th>
              <th>Type</th>
            </tr>
          </thead>
          <tbody>
            { values.map(([label, dataType]: TypeMapping, i: number) => (
              <tr key={i}>
                <td>
                  {label}
                </td>
                <td>
                  <select
                    value={dataType}
                    onChange={(event: React.ChangeEvent<HTMLSelectElement>) => {
                      const newValues = values.map((mapping: TypeMapping, j: number) => {
                        const newValue = event.target.value === SelectEmptyValue ? undefined : event.target.value;

                        return i === j ? [label, newValue] : mapping;
                      });

                      onChange(newValues);
                    }}
                  >
                    {selectOptions.map((option: DataType) => (
                      <option key={option.id} value={option.name}>
                        {option.display_name}
                      </option>
                    ))}
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table> : null
      }
    </div>
  );
};

export default ValueMapping;
