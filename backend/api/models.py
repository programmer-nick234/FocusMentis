from django.db import models
from django.contrib.auth.models import User
from django.utils import timezone


class AudioTrack(models.Model):
    """Model for storing uploaded audio tracks"""
    STYLE_CHOICES = [
        ('lofi', 'Lo-fi'),
        ('phonk', 'Phonk'),
        ('melody', 'Melody'),
        ('8d', '8D Audio'),
    ]
    
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='audio_tracks')
    original_file = models.FileField(upload_to='original_tracks/')
    track_name = models.CharField(max_length=255)
    duration_seconds = models.FloatField(default=0)
    file_size_mb = models.FloatField(default=0)
    
    # Audio metadata
    tempo = models.FloatField(null=True, blank=True)
    key = models.CharField(max_length=10, blank=True)
    energy = models.FloatField(null=True, blank=True)
    valence = models.FloatField(null=True, blank=True)
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        ordering = ['-created_at']
    
    def __str__(self):
        return f"{self.track_name}"


class TransformedTrack(models.Model):
    """Model for storing transformed audio tracks"""
    STYLE_CHOICES = [
        ('lofi', 'Lo-fi'),
        ('phonk', 'Phonk'),
        ('melody', 'Melody'),
        ('8d', '8D Audio'),
    ]
    
    STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('processing', 'Processing'),
        ('completed', 'Completed'),
        ('failed', 'Failed'),
    ]
    
    original_track = models.ForeignKey(AudioTrack, on_delete=models.CASCADE, related_name='transformations')
    style = models.CharField(max_length=20, choices=STYLE_CHOICES)
    transformed_file = models.FileField(upload_to='transformed_tracks/', blank=True, null=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    processing_time_seconds = models.FloatField(null=True, blank=True)
    error_message = models.TextField(blank=True)
    
    # Transformation parameters
    tempo_shift = models.FloatField(default=0)  # BPM change
    pitch_shift = models.FloatField(default=0)  # Semitones
    reverb_amount = models.FloatField(default=0)  # 0-1
    filter_cutoff = models.FloatField(default=0)  # Hz
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        ordering = ['-created_at']
        unique_together = ['original_track', 'style']
    
    def __str__(self):
        return f"{self.original_track.track_name} - {self.get_style_display()}"


class UserProfile(models.Model):
    """Extended user profile for FocusMentex"""
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='profile')
    total_tracks_uploaded = models.IntegerField(default=0)
    total_transformations = models.IntegerField(default=0)
    total_processing_time = models.FloatField(default=0)  # in seconds
    preferred_styles = models.JSONField(default=list)  # List of preferred styles
    
    # Subscription/usage tracking
    monthly_uploads = models.IntegerField(default=0)
    monthly_transformations = models.IntegerField(default=0)
    subscription_tier = models.CharField(max_length=20, default='free', choices=[
        ('free', 'Free'),
        ('pro', 'Pro'),
        ('enterprise', 'Enterprise'),
    ])
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    def __str__(self):
        return f"Profile for {self.user.username}"


class ProcessingJob(models.Model):
    """Model for tracking audio processing jobs"""
    STATUS_CHOICES = [
        ('queued', 'Queued'),
        ('processing', 'Processing'),
        ('completed', 'Completed'),
        ('failed', 'Failed'),
        ('cancelled', 'Cancelled'),
    ]
    
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='processing_jobs')
    transformed_track = models.OneToOneField(TransformedTrack, on_delete=models.CASCADE, related_name='job')
    job_id = models.CharField(max_length=100, unique=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='queued')
    progress_percentage = models.IntegerField(default=0)
    started_at = models.DateTimeField(null=True, blank=True)
    completed_at = models.DateTimeField(null=True, blank=True)
    error_details = models.TextField(blank=True)
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        ordering = ['-created_at']
    
    def __str__(self):
        return f"Job {self.job_id} - {self.transformed_track.original_track.track_name}"
