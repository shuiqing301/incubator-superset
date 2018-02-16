import React from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';

import DragDroppable from '../dnd/DragDroppable';
import DragHandle from '../dnd/DragHandle';
import EditableTitle from '../../../../components/EditableTitle';
import HoverMenu from '../menu/HoverMenu';
import WithPopoverMenu from '../menu/WithPopoverMenu';
import DeleteComponentButton from '../DeleteComponentButton';
import PopoverDropdown from '../menu/PopoverDropdown';
import headerStyleOptions from '../menu/headerStyleOptions';
import rowStyleOptions from '../menu/rowStyleOptions';
import { componentShape } from '../../util/propShapes';
import { SMALL_HEADER } from '../../util/constants';

const propTypes = {
  component: componentShape.isRequired,
  components: PropTypes.object.isRequired,
  index: PropTypes.number.isRequired,
  parentId: PropTypes.string.isRequired,
  handleComponentDrop: PropTypes.func.isRequired,
  deleteComponent: PropTypes.func.isRequired,
  updateComponents: PropTypes.func.isRequired,
};

const defaultProps = {
};

class Header extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      isFocused: false,
    };
    this.handleDeleteComponent = this.handleDeleteComponent.bind(this);
    this.handleChangeFocus = this.handleChangeFocus.bind(this);
    this.handleUpdateMeta = this.handleUpdateMeta.bind(this);
    this.handleChangeSize = this.handleUpdateMeta.bind(this, 'size');
    this.handleChangeRowStyle = this.handleUpdateMeta.bind(this, 'rowStyle');
    this.handleChangeText = this.handleUpdateMeta.bind(this, 'text');
  }

  handleChangeFocus(nextFocus) {
    this.setState(() => ({ isFocused: nextFocus }));
  }

  handleUpdateMeta(metaKey, nextValue) {
    const { updateComponents, component } = this.props;
    if (nextValue && component.meta[metaKey] !== nextValue) {
      updateComponents({
        [component.id]: {
          ...component,
          meta: {
            ...component.meta,
            [metaKey]: nextValue,
          },
        },
      });
    }
  }

  handleDeleteComponent() {
    const { deleteComponent, component, parentId } = this.props;
    deleteComponent(component.id, parentId);
  }

  render() {
    const { isFocused } = this.state;

    const {
      component,
      components,
      index,
      parentId,
      handleComponentDrop,
    } = this.props;

    const headerStyle = headerStyleOptions.find(
      opt => opt.value === (component.meta.size || SMALL_HEADER),
    );

    const rowStyle = rowStyleOptions.find(
      opt => opt.value === (component.meta.rowStyle || SMALL_HEADER),
    );

    return (
      <DragDroppable
        component={component}
        components={components}
        orientation="row"
        index={index}
        parentId={parentId}
        onDrop={handleComponentDrop}
        disableDragDrop={isFocused}
      >
        {({ dropIndicatorProps, dragSourceRef }) => (
          <div ref={dragSourceRef}>
            <HoverMenu position="left">
              <DragHandle position="left" />
            </HoverMenu>

            <WithPopoverMenu
              onChangeFocus={this.handleChangeFocus}
              menuItems={[
                <PopoverDropdown
                  id={`${component.id}-header-style`}
                  options={headerStyleOptions}
                  value={component.meta.size}
                  onChange={this.handleChangeSize}
                  renderTitle={option => `${option.label} header`}
                />,
                <PopoverDropdown
                  id={`${component.id}-row-style`}
                  options={rowStyleOptions}
                  value={component.meta.rowStyle}
                  onChange={this.handleChangeRowStyle}
                  renderButton={option => (
                    <div className={cx('row-style-option', option.className)}>
                      {`${option.label} background`}
                    </div>
                  )}
                  renderOption={option => (
                    <div className={cx('row-style-option', option.className)}>
                      {option.label}
                    </div>
                  )}
                />,
                <DeleteComponentButton onDelete={this.handleDeleteComponent} />,
              ]}
            >
              <div
                className={cx(
                  'dashboard-component',
                  'dashboard-component-header',
                  headerStyle.className,
                  rowStyle.className,
                )}
              >
                <EditableTitle
                  title={component.meta.text}
                  canEdit={isFocused}
                  onSaveTitle={this.handleChangeText}
                  showTooltip={false}
                />
              </div>
            </WithPopoverMenu>

            {dropIndicatorProps && <div {...dropIndicatorProps} />}
          </div>
        )}
      </DragDroppable>
    );
  }
}

Header.propTypes = propTypes;
Header.defaultProps = defaultProps;

export default Header;
