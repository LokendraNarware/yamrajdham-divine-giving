import { NextRequest, NextResponse } from 'next/server';
import { EmailSettingsService } from '@/services/email-settings';
import { logger } from '@/lib/structured-logger';

export async function GET(request: NextRequest) {
  try {
    const result = await EmailSettingsService.getAllSettings();

    if (result.success) {
      return NextResponse.json({
        success: true,
        data: result.data,
      });
    } else {
      logger.error('Failed to fetch email settings', { error: result.error });
      return NextResponse.json(
        { success: false, error: 'Failed to fetch email settings' },
        { status: 500 }
      );
    }
  } catch (error) {
    logger.error('Exception in GET /api/admin/email-settings', { error });
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { settings, updatedBy } = body;

    if (!settings || typeof settings !== 'object') {
      return NextResponse.json(
        { success: false, error: 'Invalid settings data' },
        { status: 400 }
      );
    }

    const result = await EmailSettingsService.updateMultipleSettings(settings, updatedBy);

    if (result.success) {
      logger.info('Email settings updated via API', { 
        settings: Object.keys(settings), 
        updatedBy 
      });
      
      return NextResponse.json({
        success: true,
        message: 'Email settings updated successfully',
        data: result.data,
      });
    } else {
      logger.error('Failed to update email settings', { error: result.error });
      return NextResponse.json(
        { success: false, error: 'Failed to update email settings' },
        { status: 500 }
      );
    }
  } catch (error) {
    logger.error('Exception in POST /api/admin/email-settings', { error });
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { settingKey, settingValue, updatedBy } = body;

    if (!settingKey || settingValue === undefined) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const result = await EmailSettingsService.updateSetting(
      settingKey,
      settingValue,
      updatedBy
    );

    if (result.success) {
      logger.info('Email setting updated via API', { 
        settingKey, 
        updatedBy 
      });
      
      return NextResponse.json({
        success: true,
        message: 'Email setting updated successfully',
        data: result.data,
      });
    } else {
      logger.error('Failed to update email setting', { 
        settingKey, 
        error: result.error 
      });
      return NextResponse.json(
        { success: false, error: 'Failed to update email setting' },
        { status: 500 }
      );
    }
  } catch (error) {
    logger.error('Exception in PUT /api/admin/email-settings', { error });
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const url = new URL(request.url);
    const action = url.searchParams.get('action');

    if (action === 'reset') {
      const body = await request.json();
      const { updatedBy } = body;

      const result = await EmailSettingsService.resetToDefaults(updatedBy);

      if (result.success) {
        logger.info('Email settings reset to defaults via API', { updatedBy });
        
        return NextResponse.json({
          success: true,
          message: 'Email settings reset to defaults successfully',
        });
      } else {
        logger.error('Failed to reset email settings', { error: result.error });
        return NextResponse.json(
          { success: false, error: 'Failed to reset email settings' },
          { status: 500 }
        );
      }
    }

    return NextResponse.json(
      { success: false, error: 'Invalid action' },
      { status: 400 }
    );
  } catch (error) {
    logger.error('Exception in DELETE /api/admin/email-settings', { error });
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
