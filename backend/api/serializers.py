from rest_framework import serializers
from django.contrib.auth.models import User
from .models import AudioTrack, TransformedTrack, UserProfile, ProcessingJob


class UserSerializer(serializers.ModelSerializer):
    """Serializer for User model"""
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'first_name', 'last_name', 'date_joined']
        read_only_fields = ['id', 'date_joined']


class UserProfileSerializer(serializers.ModelSerializer):
    """Serializer for UserProfile model"""
    user = UserSerializer(read_only=True)
    
    class Meta:
        model = UserProfile
        fields = [
            'id', 'user', 'total_tracks_uploaded', 'total_transformations',
            'total_processing_time', 'preferred_styles', 'monthly_uploads',
            'monthly_transformations', 'subscription_tier', 'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']


class AudioTrackSerializer(serializers.ModelSerializer):
    """Serializer for AudioTrack model"""
    user = UserSerializer(read_only=True)
    file_url = serializers.SerializerMethodField()
    
    class Meta:
        model = AudioTrack
        fields = [
            'id', 'user', 'original_file', 'file_url', 'track_name',
            'duration_seconds', 'file_size_mb', 'tempo', 'key', 'energy', 'valence',
            'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']
    
    def get_file_url(self, obj):
        if obj.original_file:
            return self.context['request'].build_absolute_uri(obj.original_file.url)
        return None
    
    def create(self, validated_data):
        """Automatically set the user to the current user"""
        from django.contrib.auth.models import User
        default_user = User.objects.first() or User.objects.create_user(
            username='demo_user',
            email='demo@focusmentex.com'
        )
        validated_data['user'] = default_user
        return super().create(validated_data)


class TransformedTrackSerializer(serializers.ModelSerializer):
    """Serializer for TransformedTrack model"""
    original_track = AudioTrackSerializer(read_only=True)
    file_url = serializers.SerializerMethodField()
    style_display = serializers.CharField(source='get_style_display', read_only=True)
    status_display = serializers.CharField(source='get_status_display', read_only=True)
    
    class Meta:
        model = TransformedTrack
        fields = [
            'id', 'original_track', 'style', 'style_display', 'transformed_file',
            'file_url', 'status', 'status_display', 'processing_time_seconds',
            'error_message', 'tempo_shift', 'pitch_shift', 'reverb_amount',
            'filter_cutoff', 'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']
    
    def get_file_url(self, obj):
        if obj.transformed_file:
            return self.context['request'].build_absolute_uri(obj.transformed_file.url)
        return None


class ProcessingJobSerializer(serializers.ModelSerializer):
    """Serializer for ProcessingJob model"""
    transformed_track = TransformedTrackSerializer(read_only=True)
    status_display = serializers.CharField(source='get_status_display', read_only=True)
    
    class Meta:
        model = ProcessingJob
        fields = [
            'id', 'user', 'transformed_track', 'job_id', 'status', 'status_display',
            'progress_percentage', 'started_at', 'completed_at', 'error_details',
            'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']


class AudioTrackUploadSerializer(serializers.ModelSerializer):
    """Serializer for uploading new audio tracks"""
    class Meta:
        model = AudioTrack
        fields = ['original_file', 'track_name']
    
    def validate_original_file(self, value):
        """Validate uploaded file"""
        # Check file size (max 50MB)
        if value.size > 50 * 1024 * 1024:
            raise serializers.ValidationError("File size must be less than 50MB")
        
        # Check file type
        allowed_types = ['audio/mpeg', 'audio/wav', 'audio/mp3', 'audio/m4a', 'audio/flac']
        if value.content_type not in allowed_types:
            raise serializers.ValidationError("Only audio files are allowed")
        
        return value
    
    def create(self, validated_data):
        """Create audio track with user and file metadata"""
        from django.contrib.auth.models import User
        default_user = User.objects.first() or User.objects.create_user(
            username='demo_user',
            email='demo@focusmentex.com'
        )
        validated_data['user'] = default_user
        
        # Calculate file size in MB
        file_size_bytes = validated_data['original_file'].size
        validated_data['file_size_mb'] = file_size_bytes / (1024 * 1024)
        
        return super().create(validated_data)


class TransformationRequestSerializer(serializers.Serializer):
    """Serializer for requesting audio transformations"""
    track_id = serializers.IntegerField()
    styles = serializers.ListField(
        child=serializers.ChoiceField(choices=TransformedTrack.STYLE_CHOICES),
        min_length=1,
        max_length=4
    )
    
    def validate_track_id(self, value):
        """Validate that the track exists and belongs to the user"""
        from django.contrib.auth.models import User
        default_user = User.objects.first() or User.objects.create_user(
            username='demo_user',
            email='demo@focusmentex.com'
        )
        try:
            track = AudioTrack.objects.get(id=value, user=default_user)
            return value
        except AudioTrack.DoesNotExist:
            raise serializers.ValidationError("Track not found or access denied")


class AudioTrackUpdateSerializer(serializers.ModelSerializer):
    """Serializer for updating audio track metadata"""
    class Meta:
        model = AudioTrack
        fields = ['track_name']
