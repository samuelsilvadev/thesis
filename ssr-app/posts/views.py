from django.contrib.auth.decorators import login_required
from django.http import HttpResponseForbidden
from django.shortcuts import get_object_or_404, redirect, render

from .forms import NoteForm
from .models import Note


def note_list(request):
    notes = Note.objects.select_related('author').all()
    return render(request, 'notes/note_list.html', {'notes': notes})


def note_detail(request, pk):
    note = get_object_or_404(Note.objects.select_related('author'), pk=pk)
    return render(request, 'notes/note_detail.html', {'note': note})


@login_required
def note_create(request):
    if request.method == 'POST':
        form = NoteForm(request.POST)
        if form.is_valid():
            note = form.save(commit=False)
            note.author = request.user
            note.save()
            return redirect('note_detail', pk=note.pk)
    else:
        form = NoteForm()
    return render(request, 'notes/note_form.html', {'form': form, 'action': 'Create'})


@login_required
def note_edit(request, pk):
    note = get_object_or_404(Note, pk=pk)
    if note.author != request.user:
        return HttpResponseForbidden("You can only edit your own notes.")
    if request.method == 'POST':
        form = NoteForm(request.POST, instance=note)
        if form.is_valid():
            form.save()
            return redirect('note_detail', pk=note.pk)
    else:
        form = NoteForm(instance=note)
    return render(request, 'notes/note_form.html', {'form': form, 'action': 'Edit'})


@login_required
def note_delete(request, pk):
    note = get_object_or_404(Note, pk=pk)
    if note.author != request.user:
        return HttpResponseForbidden("You can only delete your own notes.")
    if request.method == 'POST':
        note.delete()
        return redirect('note_list')
    return render(request, 'notes/note_confirm_delete.html', {'note': note})
