import { useRouter } from 'next/router'
import { NextPageWithLayout } from 'pages/_app'
import { useEffect, useMemo, useState } from 'react'
import withDashboardLayout from 'src/components/layout/DashboardLayout'
import { Route } from 'src/const/Route'
import { useAppDispatch, useAppSelector } from 'src/hook/useRedux'
import useRequest from 'src/hook/useRequest'
import ReducerActions from 'src/redux/ReducerAction'
import { User } from 'src/request/user/User.model'
import UserConfig from 'src/request/user/UserConfig'

const User: NextPageWithLayout = () => {
  const dispatch = useAppDispatch()
  const allUserLevel = useMemo(() => ['guest', 'administrator', 'user'] as const, [])
  const router = useRouter()
  const [users, setUsers] = useState<User[]>([])
  const { account } = useAppSelector(state => state)
  const { authReq } = useRequest()

  useEffect(() => {
    if (account.level !== 'administrator') return
    dispatch(ReducerActions.ui.setTitle('Akses Pengguna'))
    dispatch(ReducerActions.ui.masterLoader(true))
    authReq<{ data: User[] }>(UserConfig.get())
      .then(res => {
        setUsers(res.data.data)
      })
      .finally(() => {
        dispatch(ReducerActions.ui.masterLoader(false))
      })
  }, [])

  const changeUserLevel = (id: string, level: User['level']) => {
    dispatch(ReducerActions.ui.masterLoader(true))
    authReq<{ data: Pick<User, '_id' | 'level'> }>(UserConfig.updateStatus(id, { level }))
      .then(res => {
        const { level, _id } = res.data.data
        const cpUsers = [...users]
        const changedIndex = cpUsers.findIndex(user => user._id === _id)
        cpUsers[changedIndex] = { ...cpUsers[changedIndex], level }
        setUsers(cpUsers)
      })
      .finally(() => dispatch(ReducerActions.ui.masterLoader(false)))
  }

  if (account.level !== 'administrator' && typeof window !== 'undefined') {
    router.push(Route.Home)
    return null
  }
  return (
    <div>
      <div className='card card-default'>
        <div className='card-header'>
          <h4>Pengguna</h4>
        </div>
        <div className='card-body'>
          <table className='table table-hover'>
            <thead>
              <tr>
                <th scope='col'>Nama</th>
                <th scope='col'>Level</th>
                <th scope='col'>Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map(user => (
                <tr key={user._id}>
                  <td scope='row'>{user.name}</td>
                  <td>{user.level.slice(0, 1).toUpperCase() + user.level.slice(1)}</td>
                  <td>
                    {allUserLevel.map(level =>
                      level !== user.level ? (
                        <button
                          className='btn btn-success mr-2'
                          key={level}
                          onClick={() => changeUserLevel(user._id, level)}>
                          {level.slice(0, 1).toUpperCase() + level.slice(1)}
                        </button>
                      ) : null
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

export default User
withDashboardLayout(User)
