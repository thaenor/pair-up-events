import React from 'react'
import { Share2 } from 'lucide-react'

const InviteFriendSection: React.FC = React.memo(() => {
  const handleInviteFriend = () => {
    // Invite functionality removed
    console.log('Invite friend clicked')
  }

  return (
    <div className="bg-white/80 backdrop-blur-sm border border-gray-200 rounded-lg p-6 mb-8">
      <h3 className="text-lg font-semibold text-pairup-darkBlue mb-4">Invite Friends</h3>

      <p className="text-pairup-darkBlue/80 mb-4">
        Share PairUp Events with your friends and help them discover amazing activities!
      </p>

      <button
        onClick={handleInviteFriend}
        className="flex items-center gap-2 px-4 py-2 bg-pairup-cyan text-pairup-darkBlue rounded-md hover:bg-pairup-cyan/90 focus:outline-none focus:ring-2 focus:ring-pairup-cyan transition-colors"
      >
        <Share2 className="w-4 h-4" />
        Invite Friends
      </button>
    </div>
  )
})

InviteFriendSection.displayName = 'InviteFriendSection'

export default InviteFriendSection
