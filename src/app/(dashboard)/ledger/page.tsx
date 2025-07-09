'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { 
  sampleTransactions, 
  getItemById 
} from '@/lib/sample-data';
import { 
  BookOpen, 
  ArrowUpRight, 
  ArrowDownRight, 
  ShoppingCart, 
  FlaskConical, 
  Search,
  TrendingUp,
  Calendar
} from 'lucide-react';

export default function Ledger() {
  const getTransactionIcon = (type: string) => {
    switch (type) {
      case 'purchase':
        return <ShoppingCart className="h-4 w-4 text-blue-500" />;
      case 'batch_usage':
        return <FlaskConical className="h-4 w-4 text-orange-500" />;
      case 'batch_creation':
        return <FlaskConical className="h-4 w-4 text-green-500" />;
      case 'spot_check':
        return <Search className="h-4 w-4 text-purple-500" />;
      case 'sale':
        return <TrendingUp className="h-4 w-4 text-emerald-500" />;
      default:
        return <BookOpen className="h-4 w-4 text-gray-500" />;
    }
  };

  const getTransactionBadge = (type: string) => {
    switch (type) {
      case 'purchase':
        return <Badge variant="outline" className="text-blue-600 border-blue-200 bg-blue-50 dark:bg-blue-900/20">Purchase</Badge>;
      case 'batch_usage':
        return <Badge variant="outline" className="text-orange-600 border-orange-200 bg-orange-50 dark:bg-orange-900/20">Batch Usage</Badge>;
      case 'batch_creation':
        return <Badge variant="outline" className="text-green-600 border-green-200 bg-green-50 dark:bg-green-900/20">Batch Creation</Badge>;
      case 'spot_check':
        return <Badge variant="outline" className="text-purple-600 border-purple-200 bg-purple-50 dark:bg-purple-900/20">Spot Check</Badge>;
      case 'sale':
        return <Badge variant="outline" className="text-emerald-600 border-emerald-200 bg-emerald-50 dark:bg-emerald-900/20">Sale</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  const formatQuantityChange = (change: number) => {
    if (change > 0) {
      return (
        <div className="flex items-center gap-1 text-green-600 dark:text-green-400">
          <ArrowUpRight className="h-4 w-4" />
          <span className="font-medium">+{change}</span>
        </div>
      );
    } else {
      return (
        <div className="flex items-center gap-1 text-red-600 dark:text-red-400">
          <ArrowDownRight className="h-4 w-4" />
          <span className="font-medium">{change}</span>
        </div>
      );
    }
  };

  const sortedTransactions = [...sampleTransactions].sort((a, b) => 
    new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Ledger</h1>
        <div className="text-sm text-muted-foreground">
          {sampleTransactions.length} total transactions
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Transactions</CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{sampleTransactions.length}</div>
            <p className="text-xs text-muted-foreground">All time</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Purchases</CardTitle>
            <ShoppingCart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {sampleTransactions.filter(t => t.type === 'purchase').length}
            </div>
            <p className="text-xs text-muted-foreground">Inventory additions</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Batch Operations</CardTitle>
            <FlaskConical className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {sampleTransactions.filter(t => t.type.includes('batch')).length}
            </div>
            <p className="text-xs text-muted-foreground">Production changes</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Adjustments</CardTitle>
            <Search className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {sampleTransactions.filter(t => t.type === 'spot_check').length}
            </div>
            <p className="text-xs text-muted-foreground">Manual corrections</p>
          </CardContent>
        </Card>
      </div>

      {/* Transaction History */}
      <Card>
        <CardHeader>
          <CardTitle>Transaction History</CardTitle>
          <CardDescription>
            Complete, immutable record of all inventory changes
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date & Time</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Item</TableHead>
                <TableHead>Quantity Change</TableHead>
                <TableHead>New Quantity</TableHead>
                <TableHead>Source ID</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sortedTransactions.map((transaction) => {
                const item = getItemById(transaction.itemId);
                
                return (
                  <TableRow key={transaction.transactionId}>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        <div>
                          <div className="font-medium">
                            {transaction.timestamp.toLocaleDateString()}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            {transaction.timestamp.toLocaleTimeString()}
                          </div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {getTransactionIcon(transaction.type)}
                        {getTransactionBadge(transaction.type)}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>
                        <div className="font-medium">{item?.name || 'Unknown Item'}</div>
                        <div className="text-sm text-muted-foreground">
                          {item?.SKU || 'N/A'}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      {formatQuantityChange(transaction.quantityChange)}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <span className="font-medium">{transaction.newQuantity}</span>
                        <span className="text-sm text-muted-foreground">
                          {item?.inventoryUnit || 'units'}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="font-mono text-sm text-muted-foreground">
                        {transaction.sourceId}
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>

          {sampleTransactions.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              <BookOpen className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No transactions recorded yet. Start by logging a purchase or batch.</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
