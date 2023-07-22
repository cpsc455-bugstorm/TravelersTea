import { TextField } from '@mui/material'
import PropTypes from 'prop-types'
import { useForm } from 'react-hook-form'
import { useSelector } from 'react-redux'
import { Button } from '../common'

StageForm.propTypes = {
  onSubmit: PropTypes.func.isRequired,
}

export function StageForm({ onSubmit }) {
  const stagesByDay = useSelector((state) => state.stages.stages)
  const editStageId = useSelector((state) => state.stages.editStageId)
  const stage = stagesByDay.flat().find((item) => item._id === editStageId)

  const { register, handleSubmit } = useForm({
    defaultValues: {
      updateNotes: '',
    },
  })

  const onSubmitForm = (data) => {
    onSubmit({ ...data, stage })
  }

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
