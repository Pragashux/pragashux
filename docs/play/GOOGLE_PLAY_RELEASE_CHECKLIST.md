# Google Play release checklist — AI LearnOS

Distinguish **ready for submission** from **approved by Google Play**. This list is the former.

- [x] Application ID finalized (`com.ailearnos.app`) — confirm it is unused on Play
- [x] Version name configured (`1.0.0`)
- [x] Version code configured (`1`)
- [x] Target SDK compliant (36)
- [x] Release signing configured (local upload keystore; **you** enroll Play App Signing)
- [x] Keystore secured (gitignored; do not lose the upload key)
- [x] Secrets removed from Android source (no LLM/JWT/payment secrets)
- [ ] Production API hosted and `API_BASE_URL` pointed at it
- [x] HTTPS enabled in release
- [x] Permissions reviewed (INTERNET, POST_NOTIFICATIONS only)
- [x] Notification permission reviewed (runtime still needed on 13+)
- [x] Account deletion reviewed
- [x] Subscription billing reviewed (abstraction + fail closed until Play SKUs)
- [x] Privacy policy created (must be **hosted**)
- [x] Terms created (legal review)
- [x] AI disclaimer reviewed
- [x] Data Safety information prepared
- [ ] Content rating questionnaire completed in Console
- [x] App icon configured
- [x] Splash screen configured
- [ ] Phone screenshots captured from the running app
- [x] Store listing copy prepared
- [x] Reviewer access instructions prepared (fill real credentials in Console only)
- [x] Automated tests completed
- [x] R8 enabled
- [x] AAB generated
- [x] AAB checksum generated
- [ ] Play Console listing, Data safety form, and billing products completed by the operator
