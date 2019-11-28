import React, { useReducer } from "react";
import { Slider, Checkbox, Select } from "antd";

function Control({ definition, value, dispatch, groupId }) {
  const { id } = definition;
  const onChange = value => {
    dispatch({ groupId, id, value });
  };

  switch (definition.type) {
    case "checkbox":
      return (
        <Checkbox
          key={id}
          style={{ marginLeft: "0px" }}
          defaultChecked={value}
          onChange={e => {
            onChange(e.target.checked);
          }}
        >
          {definition.label}
        </Checkbox>
      );
    case "slider":
      const label = definition.range
        ? `${definition.label} (${value[0]}-${value[1]})`
        : definition.label;
      return (
        <div key={id}>
          <div>{label}</div>
          <Slider
            style={{ margin: "0px" }}
            range={definition.range}
            min={definition.min}
            max={definition.max}
            defaultValue={definition.value}
            onAfterChange={onChange}
            step={definition.step}
          />
        </div>
      );
    case "select":
      return (
        <div key={id}>
          <div>{definition.label}</div>
          <Select defaultValue={definition.value} onChange={onChange}>
            {definition.options.map(option => (
              <Select.Option value={option.value} key={option.value}>
                {option.label}
              </Select.Option>
            ))}
          </Select>
        </div>
      );
    case "group":
      return (
        <div key={id} style={{ padding: "6px" }}>
          <h4>{definition.label}</h4>
          <div>
            {definition.children.map(child => (
              <div style={{ padding: "2px" }} key={child.id}>
                <Control
                  groupId={definition.id}
                  definition={child}
                  value={value[child.id]}
                  dispatch={dispatch}
                />
              </div>
            ))}
          </div>
        </div>
      );
    default:
      console.error(`Unsupported control type ${definition.type}`);
      return <></>;
  }
}

function Controls({ state, definitions, dispatch }) {
  return definitions.map(definition => (
    <Control
      key={definition.id}
      definition={definition}
      value={state[definition.id]}
      dispatch={dispatch}
    />
  ));
}

function controlsReducer(state, action) {
  const { groupId, id, value } = action;
  if (groupId != null) {
    const group = state[groupId];
    return { ...state, [groupId]: { ...group, [id]: value } };
  } else {
    return { ...state, [id]: value };
  }
}

function defaultControlValues(controlDefinitions) {
  const defaultState = {};
  for (let definition of controlDefinitions) {
    if (definition.type === "group") {
      defaultState[definition.id] = defaultControlValues(definition.children);
    } else {
      const { id, value } = definition;
      defaultState[id] = value;
    }
  }
  return defaultState;
}

export default function useControls(definitions) {
  const [controls, controlsDispatch] = useReducer(
    controlsReducer,
    defaultControlValues(definitions)
  );

  return [
    controls,
    <Controls
      dispatch={controlsDispatch}
      state={controls}
      definitions={definitions}
    />
  ];
}
