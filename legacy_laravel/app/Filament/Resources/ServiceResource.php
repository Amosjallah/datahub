<?php

namespace App\Filament\Resources;

use App\Filament\Resources\ServiceResource\Pages;
use App\Models\Service;
use Filament\Forms;
use Filament\Forms\Form;
use Filament\Resources\Resource;
use Filament\Tables;
use Filament\Tables\Table;

class ServiceResource extends Resource
{
    protected static ?string $model = Service::class;
    protected static ?string $navigationIcon = 'heroicon-o-rectangle-stack';
    protected static ?string $navigationGroup = 'VTU Services';

    public static function form(Form $form): Form
    {
        return $form->schema([
            Forms\Components\Section::make('Service Details')->schema([
                Forms\Components\TextInput::make('name')->required(),
                Forms\Components\Select::make('type')
                    ->options([
                        'airtime' => 'Airtime',
                        'data' => 'Data Bundle',
                        'bill' => 'Bill Payment',
                        'pin' => 'Educational PIN',
                        'esim' => 'E-SIM',
                    ])->required(),
                Forms\Components\Select::make('network')
                    ->options([
                        'MTN' => 'MTN',
                        'Telecel' => 'Telecel',
                        'AirtelTigo' => 'AirtelTigo',
                        'ECG' => 'ECG (Electricity)',
                        'GWCL' => 'Ghana Water Company',
                        'DSTV' => 'DStv',
                        'GOTV' => 'GOtv',
                        'StarTimes' => 'StarTimes',
                    ])->required(),
                Forms\Components\TextInput::make('provider_identifier')->required(),
                Forms\Components\TextInput::make('provider_adapter')->required()
                    ->default('App\\Services\\Providers\\DummyProviderAdapter'),
            ])->columns(2),

            Forms\Components\Section::make('Pricing (GHS ₵)')->schema([
                Forms\Components\TextInput::make('cost_price')->numeric()->required()->prefix('₵'),
                Forms\Components\TextInput::make('retail_price')->numeric()->required()->prefix('₵'),
                Forms\Components\TextInput::make('agent_price')->numeric()->required()->prefix('₵'),
                Forms\Components\TextInput::make('super_agent_price')->numeric()->nullable()->prefix('₵'),
            ])->columns(2),

            Forms\Components\Toggle::make('is_active')->label('Active')->default(true),
        ]);
    }

    public static function table(Table $table): Table
    {
        return $table
            ->columns([
                Tables\Columns\TextColumn::make('name')->searchable()->sortable(),
                Tables\Columns\BadgeColumn::make('type'),
                Tables\Columns\TextColumn::make('network')->sortable(),
                Tables\Columns\TextColumn::make('cost_price')->money('GHS')->label('Cost'),
                Tables\Columns\TextColumn::make('retail_price')->money('GHS')->label('Retail'),
                Tables\Columns\TextColumn::make('agent_price')->money('GHS')->label('Agent'),
                Tables\Columns\IconColumn::make('is_active')->boolean()->label('Active'),
            ])
            ->filters([
                Tables\Filters\SelectFilter::make('type')
                    ->options(['airtime' => 'Airtime', 'data' => 'Data', 'bill' => 'Bill', 'pin' => 'PIN']),
                Tables\Filters\SelectFilter::make('network')
                    ->options(['MTN' => 'MTN', 'Telecel' => 'Telecel', 'AirtelTigo' => 'AirtelTigo']),
            ])
            ->actions([
                Tables\Actions\EditAction::make(),
                Tables\Actions\Action::make('toggle')
                    ->label(fn (Service $record) => $record->is_active ? 'Disable' : 'Enable')
                    ->action(fn (Service $record) => $record->update(['is_active' => ! $record->is_active]))
                    ->color(fn (Service $record) => $record->is_active ? 'danger' : 'success'),
            ]);
    }

    public static function getPages(): array
    {
        return [
            'index' => Pages\ListServices::route('/'),
            'create' => Pages\CreateService::route('/create'),
            'edit' => Pages\EditService::route('/{record}/edit'),
        ];
    }
}
