
        let notes = [];
        let currentNoteId = null;
        let isEditing = false;

        // Initialize the app
        function initApp() {
            // Load sample notes
            notes = [
                {
                    id: 1,
                    title: 'Welcome to Notes',
                    content: 'This is your first note! You can edit this note or create new ones using the "New" button. The app automatically saves your changes.',
                    lastModified: new Date().toISOString()
                },
                {
                    id: 2,
                    title: 'Meeting Notes',
                    content: 'Project timeline discussion:\n\n• Phase 1: Research and planning\n• Phase 2: Development\n• Phase 3: Testing and deployment\n\nAction items:\n- Follow up on budget approval\n- Schedule next meeting\n- Prepare presentation materials',
                    lastModified: new Date(Date.now() - 86400000).toISOString()
                },
                {
                    id: 3,
                    title: 'Ideas & Inspiration',
                    content: 'Random thoughts and ideas:\n\n💡 App improvement ideas\n💡 Blog post topics\n💡 Weekend project concepts\n\nRemember to review these weekly and act on the most promising ones.',
                    lastModified: new Date(Date.now() - 172800000).toISOString()
                }
            ];

            renderNotes();
            selectNote(notes[0].id);
            setupEventListeners();
        }

        function setupEventListeners() {
            // Search functionality
            document.getElementById('searchInput').addEventListener('input', function(e) {
                const query = e.target.value.toLowerCase();
                renderNotes(query);
            });

            // Auto-save on content change
            document.getElementById('noteContent').addEventListener('input', function() {
                if (currentNoteId && !isEditing) {
                    isEditing = true;
                    setTimeout(autoSave, 1000);
                }
            });

            // Auto-save on title change
            document.getElementById('noteTitleInput').addEventListener('input', function() {
                if (currentNoteId && !isEditing) {
                    isEditing = true;
                    setTimeout(autoSave, 1000);
                }
            });

            // Close sidebar when clicking outside on mobile
            document.addEventListener('click', function(e) {
                const sidebar = document.getElementById('sidebar');
                const toggleBtn = document.querySelector('.mobile-toggle');
                
                if (window.innerWidth <= 768 && 
                    !sidebar.contains(e.target) && 
                    !toggleBtn.contains(e.target) && 
                    sidebar.classList.contains('show')) {
                    toggleSidebar();
                }
            });
        }

        function renderNotes(searchQuery = '') {
            const container = document.getElementById('notesContainer');
            const filteredNotes = notes.filter(note => 
                note.title.toLowerCase().includes(searchQuery) ||
                note.content.toLowerCase().includes(searchQuery)
            );

            container.innerHTML = filteredNotes.map(note => {
                const preview = note.content.length > 100 
                    ? note.content.substring(0, 100) + '...' 
                    : note.content;
                
                const formattedDate = new Date(note.lastModified).toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                });

                return `
                    <div class="note-item ${currentNoteId === note.id ? 'active' : ''}" 
                         onclick="selectNote(${note.id})">
                        <div class="note-title">${note.title}</div>
                        <div class="note-preview">${preview}</div>
                        <div class="note-date">${formattedDate}</div>
                    </div>
                `;
            }).join('');
        }

        function selectNote(noteId) {
            currentNoteId = noteId;
            const note = notes.find(n => n.id === noteId);
            
            if (note) {
                document.getElementById('noteTitleInput').value = note.title;
                document.getElementById('noteContent').value = note.content;
                document.getElementById('noteContent').style.display = 'block';
                document.getElementById('emptyState').style.display = 'none';
                
                // Update active state in sidebar
                renderNotes(document.getElementById('searchInput').value);
                
                // Close sidebar on mobile after selecting
                if (window.innerWidth <= 768) {
                    document.getElementById('sidebar').classList.remove('show');
                }
            }
        }

        function createNewNote() {
            const newNote = {
                id: Date.now(),
                title: 'New Note',
                content: '',
                lastModified: new Date().toISOString()
            };
            
            notes.unshift(newNote);
            renderNotes();
            selectNote(newNote.id);
            
            // Focus on title input
            document.getElementById('noteTitleInput').focus();
            document.getElementById('noteTitleInput').select();
        }

        function saveNote() {
            if (!currentNoteId) return;
            
            const note = notes.find(n => n.id === currentNoteId);
            if (note) {
                note.title = document.getElementById('noteTitleInput').value || 'Untitled Note';
                note.content = document.getElementById('noteContent').value;
                note.lastModified = new Date().toISOString();
                
                renderNotes(document.getElementById('searchInput').value);
                showNotification('Note saved successfully!');
                isEditing = false;
            }
        }

        function autoSave() {
            if (isEditing && currentNoteId) {
                saveNote();
            }
        }

        function deleteNote() {
            if (!currentNoteId) return;
            
            if (confirm('Are you sure you want to delete this note?')) {
                notes = notes.filter(n => n.id !== currentNoteId);
                
                if (notes.length > 0) {
                    selectNote(notes[0].id);
                } else {
                    currentNoteId = null;
                    document.getElementById('noteTitleInput').value = '';
                    document.getElementById('noteContent').value = '';
                    document.getElementById('noteContent').style.display = 'none';
                    document.getElementById('emptyState').style.display = 'flex';
                }
                
                renderNotes();
                showNotification('Note deleted successfully!');
            }
        }

        function toggleSidebar() {
            document.getElementById('sidebar').classList.toggle('show');
        }

        function showNotification(message) {
            // Create a simple notification
            const notification = document.createElement('div');
            notification.textContent = message;
            notification.style.cssText = `
                position: fixed;
                top: 20px;
                right: 20px;
                background: #10b981;
                color: white;
                padding: 12px 20px;
                border-radius: 8px;
                z-index: 1001;
                animation: fadeInUp 0.3s ease;
                box-shadow: 0 4px 20px rgba(16, 185, 129, 0.3);
            `;
            
            document.body.appendChild(notification);
            
            setTimeout(() => {
                notification.remove();
            }, 3000);
        }

        // Initialize the app when the page loads
        document.addEventListener('DOMContentLoaded', initApp);

        // Handle window resize
        window.addEventListener('resize', function() {
            if (window.innerWidth > 768) {
                document.getElementById('sidebar').classList.remove('show');
            }
        });
