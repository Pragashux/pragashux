# Google Play Data Safety — AI LearnOS

Fill Play Console Data safety to match this table. Do not claim collection you do not perform.

| Category (Play wording) | Collected | Shared | Purpose | Optional | Encrypted in transit | Users can request deletion |
|---|---|---|---|---|---|---|
| Name | Yes | No | App functionality, account | No (if registered) | Yes (HTTPS) | Yes |
| Email | Yes | No | App functionality, account | No | Yes | Yes |
| User IDs | Yes (account id) | No | App functionality | No | Yes | Yes |
| Passwords | Handled by app/server auth; not stored on device | No | Account | No | Yes | N/A (hashed server-side) |
| Other in-app messages (AI tutor) | Yes | Shared with operator backend; may be sent to LLM provider **from the server** | App functionality | Yes (don’t use tutor) | Yes | Yes with account |
| App interactions (course/lesson progress, quiz results) | Yes | No | App functionality, analytics (product) | No while enrolled | Yes | Yes |
| In-app purchase history | When Play Billing is live | Google Play | App functionality | Yes | Play-managed | Play + account deletion |
| Crash logs | No in this source drop | — | — | — | — | — |
| Device or other IDs | Not collected by us beyond OS/Play | — | — | — | — | — |
| Location, photos, contacts, SMS, microphone, camera | **No** | — | — | — | — | — |

**Data encrypted in transit:** yes (release HTTPS).  
**Encrypted at rest on device:** access token via Android encrypted prefs.  
**Account deletion:** Settings → Delete account.  
**Children:** not targeted; do not select “primarily for children.”
