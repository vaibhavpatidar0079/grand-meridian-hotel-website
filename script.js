        document.addEventListener('DOMContentLoaded', () => {
            const navbar = document.getElementById('navbar');
            const bookingSection = document.getElementById('booking-section');
            const contactSection = document.getElementById('contact');
            const mobileMenuBtn = document.getElementById('mobile-menu-btn');
            const mobileMenu = document.getElementById('mobile-menu');
            
            const scrollToElement = (element) => {
                if (element) element.scrollIntoView({ behavior: 'smooth' });
            };

            window.addEventListener('scroll', () => {
                if (window.scrollY > 100) {
                    navbar.classList.add('navbar-scroll');
                } else {
                    navbar.classList.remove('navbar-scroll');
                }
            });

            // Mobile menu toggle with icon swap
            if (mobileMenuBtn && mobileMenu) {
                mobileMenuBtn.addEventListener('click', () => {
                    const isOpen = mobileMenu.classList.contains('scale-y-100');
                    if (isOpen) {
                        mobileMenu.classList.remove('scale-y-100', 'opacity-100', 'pointer-events-auto');
                        mobileMenu.classList.add('pointer-events-none');
                        mobileMenuBtn.innerHTML = '<i class="ri-menu-3-line text-2xl"></i>';
                    } else {
                        mobileMenu.classList.add('scale-y-100', 'opacity-100', 'pointer-events-auto');
                        mobileMenu.classList.remove('pointer-events-none');
                        mobileMenuBtn.innerHTML = '<i class="ri-close-line text-2xl"></i>';
                    }
                });

                document.querySelectorAll('.mobile-nav-link').forEach(link => {
                    link.addEventListener('click', () => {
                        mobileMenu.classList.remove('scale-y-100', 'opacity-100', 'pointer-events-auto');
                        mobileMenu.classList.add('pointer-events-none');
                        mobileMenuBtn.innerHTML = '<i class="ri-menu-3-line text-2xl"></i>';
                        
                        // Delay scroll slightly so menu can close first
                        const targetId = link.getAttribute('href');
                        if (targetId && targetId !== '#') {
                            const target = document.querySelector(targetId);
                            if (target) setTimeout(() => scrollToElement(target), 300);
                        }
                    });
                });
            }

            const slides = document.querySelectorAll('.hero-slide');
            const dots = document.querySelectorAll('.progress-dot');
            const prevBtn = document.querySelector('.nav-arrow.prev');
            const nextBtn = document.querySelector('.nav-arrow.next');
            let currentSlide = 0;
            let slideInterval;

            const showSlide = (index) => {
                slides.forEach((slide, i) => slide.classList.toggle('active', i === index));
                dots.forEach((dot, i) => dot.classList.toggle('active', i === index));
                currentSlide = index;
            };

            // Wrap around using modulo for infinite loop
            const nextSlide = () => {
                currentSlide = (currentSlide + 1) % slides.length;
                showSlide(currentSlide);
            };

            const prevSlide = () => {
                currentSlide = (currentSlide - 1 + slides.length) % slides.length;
                showSlide(currentSlide);
            };

            const resetInterval = () => {
                clearInterval(slideInterval);
                slideInterval = setInterval(nextSlide, 8000);
            };

            if (slides.length > 0) {
                if (nextBtn) nextBtn.addEventListener('click', () => { nextSlide(); resetInterval(); });
                if (prevBtn) prevBtn.addEventListener('click', () => { prevSlide(); resetInterval(); });
                dots.forEach((dot, index) => dot.addEventListener('click', () => { showSlide(index); resetInterval(); }));
                resetInterval();
            }

            // Creates custom dropdowns for form fields
            const setupDropdown = (triggerId, options) => {
                const trigger = document.getElementById(triggerId);
                if (!trigger) return;

                const dropdown = document.createElement('div');
                dropdown.className = 'absolute top-full left-0 right-0 mt-2 bg-white rounded-lg shadow-lg z-50 py-2 border border-gray-200 hidden';
                
                options.forEach(item => {
                    const option = document.createElement('div');
                    option.className = 'px-4 py-2 hover:bg-gray-100 cursor-pointer text-gray-800';
                    option.textContent = item;
                    option.onclick = () => {
                        trigger.querySelector('span').textContent = item;
                        dropdown.classList.add('hidden');
                    };
                    dropdown.appendChild(option);
                });

                trigger.parentElement.appendChild(dropdown);

                trigger.addEventListener('click', (e) => {
                    e.stopPropagation();
                    // Close any other open dropdowns first
                    document.querySelectorAll('.absolute.z-50').forEach(d => {
                        if (d !== dropdown) d.classList.add('hidden');
                    });
                    dropdown.classList.toggle('hidden');
                });

                // Close on outside click
                document.addEventListener('click', () => dropdown.classList.add('hidden'));
            };

            setupDropdown('guestSelector', [
                '1 Adult, 0 Children', '2 Adults, 0 Children', '2 Adults, 1 Child',
                '2 Adults, 2 Children', '3 Adults, 0 Children', '4 Adults, 0 Children'
            ]);

            setupDropdown('roomTypeSelector', [
                'Deluxe Suite', 'Presidential Suite', 'Superior Room',
                'Family Room', 'Executive Room', 'Honeymoon Suite'
            ]);

            const acSwitch = document.getElementById('acSwitch');
            if (acSwitch) {
                acSwitch.addEventListener('click', () => {
                    acSwitch.classList.toggle('active');
                    acSwitch.setAttribute('aria-checked', acSwitch.classList.contains('active'));
                });
            }

            // Custom radio buttons - styled divs instead of actual inputs
            const customRadios = document.querySelectorAll('.custom-radio');
            customRadios.forEach(radio => {
                Object.assign(radio.style, {
                    width: '20px', height: '20px', borderRadius: '50%',
                    border: '2px solid #F59E0B', cursor: 'pointer', transition: 'all 0.3s ease'
                });
                
                radio.parentElement.addEventListener('click', () => {
                    customRadios.forEach(r => r.style.background = 'transparent');
                    radio.style.background = '#F59E0B';
                });
            });
            // Default to first option selected
            if (customRadios.length) customRadios[0].style.background = '#F59E0B';

            const track = document.getElementById('testimonialTrack');
            const tDots = document.querySelectorAll('.testimonial-nav-dot');
            
            if (track && tDots.length) {
                let tIndex = 0;
                let tInterval;

                // Slide testimonials horizontally by percentage
                const updateTestimonials = (index) => {
                    track.style.transform = `translateX(-${index * 100}%)`;
                    tDots.forEach((d, i) => {
                        d.classList.toggle('bg-primary', i === index);
                        d.classList.toggle('bg-gray-300', i !== index);
                    });
                    tIndex = index;
                };

                const startTInterval = () => tInterval = setInterval(() => {
                    updateTestimonials((tIndex + 1) % tDots.length);
                }, 6000);

                tDots.forEach((dot, i) => {
                    dot.addEventListener('click', () => {
                        updateTestimonials(i);
                        clearInterval(tInterval);
                        startTInterval();
                    });
                });
                startTInterval();
            }

            // Animate elements as they scroll into view
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) entry.target.classList.add('visible');
                });
            }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

            document.querySelectorAll('.room-card, .feature-icon, .testimonial-card').forEach(el => {
                el.classList.add('fade-in');
                observer.observe(el);
            });

            // Smooth scroll for anchor links
            document.querySelectorAll('a[href^="#"]').forEach(link => {
                if (link.classList.contains('mobile-nav-link')) return;
                link.addEventListener('click', function(e) {
                    e.preventDefault();
                    const target = document.querySelector(this.getAttribute('href'));
                    scrollToElement(target);
                });
            });

            // Fill form when booking from room card
            document.querySelectorAll('.book-room-btn').forEach(btn => {
                btn.addEventListener('click', (e) => {
                    e.preventDefault();
                    const roomType = btn.dataset.roomType;
                    const price = btn.dataset.roomPrice;
                    
                    if (bookingSection) {
                        scrollToElement(bookingSection);
                        
                        const roomSelector = document.getElementById('roomTypeSelector');
                        if (roomSelector) {
                            roomSelector.querySelector('span').textContent = roomType;
                            roomSelector.classList.add('room-type-highlight');
                            setTimeout(() => roomSelector.classList.remove('room-type-highlight'), 2000);
                        }

                        const submitBtn = document.getElementById('bookingSubmitBtn');
                        if (submitBtn) submitBtn.textContent = `Reserve Now - $${price}/night`;
                    }
                });
            });

            // Route button clicks based on text content
            document.querySelectorAll('button').forEach(btn => {
                const text = btn.textContent.trim().toLowerCase();
                
                if (text.includes('book') && !btn.classList.contains('book-room-btn')) {
                    btn.addEventListener('click', (e) => {
                        e.preventDefault();
                        scrollToElement(bookingSection);
                        // Close mobile menu if open
                        if (mobileMenu && mobileMenu.classList.contains('scale-y-100')) {
                             mobileMenu.classList.remove('scale-y-100', 'opacity-100', 'pointer-events-auto');
                             mobileMenu.classList.add('pointer-events-none');
                             mobileMenuBtn.innerHTML = '<i class="ri-menu-3-line text-2xl"></i>';
                        }
                    });
                }
                
                if (text === 'virtual tour') {
                    btn.addEventListener('click', (e) => {
                        e.preventDefault();
                        scrollToElement(document.getElementById('photo-gallery'));
                    });
                }
            });
            
            const contactBtn = document.getElementById('contactUsBtn');
            if (contactBtn) contactBtn.addEventListener('click', () => scrollToElement(contactSection));
        });