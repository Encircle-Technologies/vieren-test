import React, { createContext, useContext, useState } from "react"

const MemberContext = createContext(null)

export const MemberProvider = ({ children }) => (
  <MemberContext.Provider value={useProvideMember()}>
    {children}
  </MemberContext.Provider>
)

export const useMember = () => useContext(MemberContext)

const useProvideMember = () => {
  const [isMember, setMemberState] = useState(false)

  return {
    isMember,
    setMemberState,
  }
}
