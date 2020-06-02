import { DragSource } from 'react-dnd'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlus } from '@fortawesome/free-solid-svg-icons'
import { ItemTypes } from '../constants/ItemTypes'
import classNames from 'classnames';
import classes from './icon.module.css'

const styles = {
  position: 'absolute',
  display: 'flex',
  padding: '0.8rem',
  borderRadius: '2rem',
  height: '50px',
  width: '50px',
  border: '2px solid white',
  cursor: 'pointer',
}

const iconStyles = {
  width: '24px',
  color: 'white'
};

const Icon = ({
  hideSourceOnDrag,
  left,
  top,
  connectDragSource,
  isDragging,
  isSelected,
  onClick,
  children,
}) => {
  if (isDragging && hideSourceOnDrag) {
    return null
  }
  return connectDragSource(
    <div className={classNames(classes.iconContainer, {
      [classes.iconContainerSelected]: isSelected
    })} style={{...styles, left, top}} onClick={onClick}>
      <FontAwesomeIcon className={classNames(classes.icon, {
        [classes.iconSelected]: isSelected
      })} icon={faPlus} style={iconStyles} />
    </div>
  )
}
export default DragSource(
  ItemTypes.ICON,
  {
    beginDrag(props) {
      const { id, left, top } = props
      return { id, left, top }
    },
    endDrag(props) {
    },
  },
  (connect, monitor) => ({
    connectDragSource: connect.dragSource(),
    isDragging: monitor.isDragging(),
  }),
)(Icon)
