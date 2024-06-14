module ApplicationCable
  class Connection < ActionCable::Connection::Base
  #   identified_by :current_user

  #   def connect
  #     self.current_user = find_verified_user
  #   end

  #   private

  #   def find_verified_user()
  #     if (verified_user = env['warden'].user)
  #       puts "AAAAAAAAAAAAAAAAAAAA verified_user :::::::::::: OK"
  #       verified_user
  #     else
  #       puts "AAAAAAAAAAAAAAAAAAAA reject_unauthorized_connection :::::::::::: No"
  #       reject_unauthorized_connection
  #     end
  #   end
   end
end
