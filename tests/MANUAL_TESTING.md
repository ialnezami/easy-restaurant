# Manual Testing Checklist

## Browser Testing

### Chrome
- [ ] User registration works correctly
- [ ] User login works correctly
- [ ] Dashboard displays correctly
- [ ] Restaurant creation form works
- [ ] Restaurant editing works
- [ ] Restaurant deletion works
- [ ] Menu creation works
- [ ] Menu item addition works
- [ ] Menu item editing works
- [ ] Menu item deletion works
- [ ] QR code displays correctly
- [ ] QR code download works
- [ ] Public menu view displays correctly
- [ ] Copy menu link works

### Firefox
- [ ] User registration works correctly
- [ ] User login works correctly
- [ ] Dashboard displays correctly
- [ ] Restaurant creation form works
- [ ] Menu creation works
- [ ] Public menu view displays correctly
- [ ] QR code displays correctly

### Safari
- [ ] User registration works correctly
- [ ] User login works correctly
- [ ] Dashboard displays correctly
- [ ] Restaurant creation form works
- [ ] Menu creation works
- [ ] Public menu view displays correctly
- [ ] QR code displays correctly

## Mobile Device Testing

### iOS (Safari)
- [ ] Responsive design works on iPhone
- [ ] Forms are usable on mobile
- [ ] Navigation works correctly
- [ ] QR code scanning works
- [ ] Public menu displays correctly
- [ ] Touch interactions work properly

### Android (Chrome)
- [ ] Responsive design works on Android
- [ ] Forms are usable on mobile
- [ ] Navigation works correctly
- [ ] QR code scanning works
- [ ] Public menu displays correctly
- [ ] Touch interactions work properly

## QR Code Testing

### QR Code Readers to Test
- [ ] iPhone Camera app
- [ ] Android Camera app
- [ ] Google Lens
- [ ] QR Code Reader apps
- [ ] WeChat QR scanner
- [ ] WhatsApp QR scanner

### QR Code Functionality
- [ ] QR code scans correctly
- [ ] QR code redirects to correct menu
- [ ] QR code works after printing
- [ ] QR code works in different lighting conditions
- [ ] QR code size is appropriate for scanning

## Form Validation Testing

### Registration Form
- [ ] Name field is required
- [ ] Email field is required
- [ ] Email format validation works
- [ ] Password field is required
- [ ] Password minimum length (6 characters) enforced
- [ ] Password confirmation must match
- [ ] Error messages display correctly
- [ ] Success message displays after registration

### Login Form
- [ ] Email field is required
- [ ] Password field is required
- [ ] Invalid credentials show error
- [ ] Valid credentials redirect to dashboard
- [ ] Error messages display correctly

### Restaurant Form
- [ ] Name field is required
- [ ] Street address field is required
- [ ] City field is required
- [ ] Country field is required
- [ ] Phone number format validation (if implemented)
- [ ] Email format validation
- [ ] Website URL format validation
- [ ] Error messages display correctly

### Menu Form
- [ ] Slug field is required
- [ ] Slug uniqueness validation
- [ ] Slug format validation
- [ ] Error messages display correctly

### Menu Item Form
- [ ] Name field is required
- [ ] Price field is required
- [ ] Price must be a number
- [ ] Price cannot be negative
- [ ] Error messages display correctly

## Error Handling Testing

### Network Errors
- [ ] Handles network timeout gracefully
- [ ] Shows appropriate error message
- [ ] Allows retry after error

### Server Errors
- [ ] Handles 500 errors gracefully
- [ ] Shows user-friendly error message
- [ ] Doesn't expose sensitive information

### Validation Errors
- [ ] Shows field-specific error messages
- [ ] Highlights invalid fields
- [ ] Prevents form submission with errors

### Not Found Errors
- [ ] 404 page for invalid routes
- [ ] Handles deleted restaurants gracefully
- [ ] Handles deleted menus gracefully
- [ ] Handles invalid menu slugs

## User Flow Testing

### Complete User Journey
1. [ ] Register new account
2. [ ] Login with new account
3. [ ] Create first restaurant
4. [ ] Edit restaurant details
5. [ ] Create menu for restaurant
6. [ ] Add multiple menu items
7. [ ] Edit menu item
8. [ ] Delete menu item
9. [ ] Generate QR code
10. [ ] Download QR code
11. [ ] View public menu via QR code
12. [ ] Update profile information
13. [ ] Change password
14. [ ] Logout

### Edge Cases
- [ ] Create restaurant without address
- [ ] Create menu without items
- [ ] Create menu item without category
- [ ] Create menu item without image
- [ ] Edit restaurant with empty fields
- [ ] Delete restaurant with menus
- [ ] Access protected routes without login
- [ ] Access other user's restaurants

## Performance Testing

- [ ] Page load times are acceptable (< 3 seconds)
- [ ] Dashboard loads quickly with many restaurants
- [ ] Menu page loads quickly with many items
- [ ] QR code generation is fast
- [ ] Form submissions are responsive
- [ ] No unnecessary API calls

## Accessibility Testing

- [ ] Keyboard navigation works
- [ ] Screen reader compatibility
- [ ] Color contrast is sufficient
- [ ] Form labels are properly associated
- [ ] Error messages are accessible
- [ ] Focus indicators are visible
- [ ] Alt text for images (if applicable)

## Security Testing

- [ ] Passwords are hashed (not visible in network requests)
- [ ] Session tokens are secure
- [ ] CSRF protection (if implemented)
- [ ] XSS protection
- [ ] SQL injection protection (MongoDB injection)
- [ ] Users can only access their own restaurants
- [ ] Users can only edit their own menus
- [ ] API endpoints require authentication

## Notes

- Test in incognito/private browsing mode
- Test with slow network connection
- Test with JavaScript disabled (should show appropriate message)
- Test with cookies disabled
- Clear cache between tests if needed
- Document any bugs found with steps to reproduce


