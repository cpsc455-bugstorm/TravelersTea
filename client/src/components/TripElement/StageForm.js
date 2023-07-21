import { TextField } from '@mui/material'
import PropTypes from 'prop-types'
import { useForm } from 'react-hook-form'
import { useDispatch, useSelector } from 'react-redux'
import { Button } from '../common'

const objectIdPropType = (props, propName, componentName) => {
  if (!props[propName]) {
    return new Error(
      'Invalid prop `' +
        propName +
        '` supplied to' +
        ' `' +
        componentName +
        '`. Prop value is null or undefined.',
    )
  }
  if (!/^[0-9a-fA-F]{24}$/.test(props[propName])) {
    return new Error(
      'Invalid prop `' +
        propName +
        '` supplied to' +
        ' `' +
        componentName +
        '`. Validation failed.',
    )
  }
}

StageForm.propTypes = {
  onSubmit: PropTypes.func.isRequired,
}

export function StageForm({ onSubmit }) {
  const dispatch = useDispatch()
  const stagesByDay = useSelector((state) => state.stages.stages)
  const editStageId = useSelector((state) => state.stages.editStageId)
  const stage = stagesByDay.flat().find((item) => item._id === editStageId)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      updateNotes: '',
    },
  })

  const onSubmitForm = (data) => {
    onSubmit({ ...data, stage })
  }

  // useEffect(() => {
  //   console.log('stage', stage)
  // }, [stage])

  return (
    <form
      onSubmit={handleSubmit(onSubmitForm)}
      className='flex flex-col space-y-4 text-center'
    >
      <div>
        <div className={'text-2xl'}>
          {stage.emoji} {stage.stageLocation}
        </div>
        <div>{stage.description}</div>
      </div>
      <TextField
        {...register('updateNotes', { required: false })}
        label='Update'
        placeholder='Tell me what you would like to change about this...'
      />
      <Button
        className='mt-4 w-full rounded bg-slate-300 hover:bg-slate-400'
        type='submit'
        onClick={() => {}}
      >
        Brew 🍵
      </Button>
    </form>
  )
}
